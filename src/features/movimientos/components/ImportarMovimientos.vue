<script setup>
/**
 * Importar movimientos desde el extracto del banco en CSV (3 pasos: subir, mapear columnas y revisar).
 * La API no tiene importación masiva: cada fila se envía con el mismo POST movimiento del formulario.
 */
import {ref, reactive, computed, onMounted} from "vue";
import axios from "axios";

import MmIcon from "@/components/mm/MmIcon.vue";
import {useAvisos} from "@/composables/useAvisos.js";
import {useGlobalState} from "@/composables/useGlobalState";
import {moneda, parseLabelEntidad} from "@/features/dashBoard/logic/formato.js";
import {useMovimientoOptions} from "../logic/OptionsMovimiento.js";
import {movimientos} from "../logic/movimientosStore.js";
import {leerCSV, detectarColumnas, construirFilas, MAX_BYTES, MAX_FILAS} from "../logic/csvImport.js";

const emit = defineEmits(["cerrar"]);

const API_URL = import.meta.env.VITE_API_URL;
const {mostrar} = useAvisos();
const {triggerGlobalRefresh} = useGlobalState();
const {entidades, categorias, divisas, fetchOptions} = useMovimientoOptions();

const paso = ref(1);
const arrastrando = ref(false);
const errorArchivo = ref("");
const archivo = ref(null); // {nombre, bytes}
const csv = ref(null); // {encabezados, datos}
const mapeoRecordado = ref(false);
const entrada = ref(null);

const mapeo = reactive({fecha: -1, descripcion: -1, monto: -1});
const destino = reactive({entidadId: "", categoriaId: "", subcategoriaId: "", divisaId: "COP"});
const recordar = ref(true);

const importando = ref(false);
const hechos = ref(0);

onMounted(async () => {
  await fetchOptions();
  destino.entidadId = entidades.value[0]?.value ?? "";
  destino.divisaId = divisas.value.some((d) => d.value === "COP") ? "COP" : (divisas.value[0]?.value ?? "COP");
  elegirCategoria(categorias.value[0]?.value ?? "");
});

// ---------- Opciones ----------
const cuentas = computed(() => entidades.value.map((e) => ({id: e.value, nombre: parseLabelEntidad(e.label).nombre})));
const subcategorias = computed(() => categorias.value.find((c) => c.value === destino.categoriaId)?.subcategorias ?? []);

function elegirCategoria(id) {
  destino.categoriaId = id;
  destino.subcategoriaId = (categorias.value.find((c) => c.value === id)?.subcategorias ?? [])[0]?.value ?? "";
}

// ---------- Paso 1: archivo ----------
const claveMapeo = (encabezados) => `mm-importar-mapeo:${encabezados.join("|")}`;

function cargarArchivo(file) {
  errorArchivo.value = "";
  if (!file) return;
  if (!/\.(csv|txt)$/i.test(file.name)) {
    errorArchivo.value = "Por ahora solo leemos CSV. Si tienes un Excel, guárdalo como CSV desde Archivo → Guardar como.";
    return;
  }
  if (file.size > MAX_BYTES) {
    errorArchivo.value = "El archivo pesa más de 5 MB.";
    return;
  }
  const lector = new FileReader();
  lector.onload = () => {
    const leido = leerCSV(String(lector.result));
    if (leido.encabezados.length < 3 || !leido.datos.length) {
      errorArchivo.value = "No encontramos filas con al menos fecha, descripción y monto.";
      return;
    }
    csv.value = leido;
    archivo.value = {nombre: file.name, bytes: file.size};

    // Si ya se importó un extracto con estas mismas columnas se reutiliza el mapeo guardado
    let guardado = null;
    try {
      guardado = JSON.parse(localStorage.getItem(claveMapeo(leido.encabezados)) ?? "null");
    } catch {
      guardado = null;
    }
    mapeoRecordado.value = Boolean(guardado);
    Object.assign(mapeo, guardado ?? detectarColumnas(leido.encabezados));
  };
  lector.onerror = () => (errorArchivo.value = "No pudimos leer el archivo.");
  lector.readAsText(file, "utf-8");
}

function alSoltar(e) {
  arrastrando.value = false;
  cargarArchivo(e.dataTransfer?.files?.[0]);
}

// ---------- Paso 2: mapeo y vista previa ----------
const normalizar = (t) => String(t ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Categoría sugerida a partir de movimientos anteriores con una descripción parecida */
const conocidos = computed(() => {
  const mapa = new Map();
  for (const m of movimientos.value) {
    const t = normalizar(m.concepto?.titulo);
    if (t.length >= 4 && m.tipo !== "TRANSFERENCIA" && !m.esSistema && m.categoriaId && !mapa.has(t)) mapa.set(t, {categoriaId: m.categoriaId, subcategoriaId: m.subcategoriaId});
  }
  return mapa;
});

function sugerir(titulo) {
  const t = normalizar(titulo);
  if (t.length < 4) return null;
  if (conocidos.value.has(t)) return conocidos.value.get(t);
  for (const [k, v] of conocidos.value) if (t.includes(k) || k.includes(t)) return v;
  return null;
}

const mapeoCompleto = computed(() => mapeo.fecha >= 0 && mapeo.descripcion >= 0 && mapeo.monto >= 0);
const columnasDetectadas = computed(() => [mapeo.fecha, mapeo.descripcion, mapeo.monto].filter((i) => i >= 0).length);

const resultado = computed(() => (csv.value && mapeoCompleto.value ? construirFilas({datos: csv.value.datos, mapeo, existentes: movimientos.value, sugerencias: sugerir}) : {filas: [], descartadas: [], recortado: false}));
const aImportar = computed(() => resultado.value.filas.filter((f) => !f.duplicado));
const duplicados = computed(() => resultado.value.filas.filter((f) => f.duplicado));
const sinCategoria = computed(() => aImportar.value.filter((f) => !f.sugerida).length);

const nombreCategoria = (id) => categorias.value.find((c) => c.value === id)?.label ?? "";
const destinoValido = computed(() => Boolean(destino.entidadId && destino.categoriaId && destino.subcategoriaId));

const puedeContinuar = computed(() => {
  if (paso.value === 1) return Boolean(csv.value);
  if (paso.value === 2) return mapeoCompleto.value && destinoValido.value && resultado.value.filas.length > 0;
  return aImportar.value.length > 0 && !importando.value;
});

// ---------- Paso 3: importar ----------
function payloadDe(f) {
  const cat = f.sugerida ?? {categoriaId: destino.categoriaId, subcategoriaId: destino.subcategoriaId};
  return {
    tipo: f.tipo,
    monto: Math.abs(f.monto),
    fecha: new Date(f.fecha.getFullYear(), f.fecha.getMonth(), f.fecha.getDate(), 12).toISOString(),
    divisaId: destino.divisaId,
    categoriaId: cat.categoriaId,
    subcategoriaId: cat.subcategoriaId,
    entidadId: destino.entidadId,
    concepto: {titulo: f.titulo, detalle: ""},
    tags: [],
    esRecurrente: false,
    origen: "IMPORTACION",
    estado: "COMPLETADO",
  };
}

async function importar() {
  importando.value = true;
  hechos.value = 0;
  const pendientes = [...aImportar.value];
  let fallidos = 0;

  // Pocas peticiones a la vez para no saturar la API
  async function trabajador() {
    while (pendientes.length) {
      const f = pendientes.shift();
      try {
        await axios.post(`${API_URL}movimiento/`, payloadDe(f), {withCredentials: true});
      } catch {
        fallidos++;
      }
      hechos.value++;
    }
  }
  await Promise.all(Array.from({length: 4}, trabajador));

  importando.value = false;
  triggerGlobalRefresh();

  const importados = aImportar.value.length - fallidos;
  if (recordar.value && csv.value) {
    try {
      localStorage.setItem(claveMapeo(csv.value.encabezados), JSON.stringify({...mapeo}));
    } catch {
      // Sin almacenamiento local: simplemente no se recuerda
    }
  }
  if (fallidos) {
    mostrar({tono: "warning", icono: "warning", titulo: `${importados} importados, ${fallidos} con error`, detalle: "Revisa la lista e importa de nuevo lo que falte.", duracion: 7000});
  } else {
    mostrar({titulo: `${importados} movimientos importados`, detalle: archivo.value.nombre});
  }
  emit("cerrar");
}

function siguiente() {
  if (paso.value < 3) paso.value++;
  else importar();
}

const pasos = [
  {n: 1, texto: "Subir archivo"},
  {n: 2, texto: "Mapear columnas"},
  {n: 3, texto: "Revisar y guardar"},
];
const kb = (b) => (b < 1024 * 100 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);
const fechaCorta = (f) => f.toLocaleDateString("es-CO", {day: "2-digit", month: "2-digit", year: "numeric"});
</script>

<template>
  <div class="mm-root" data-theme="light">
    <div class="mm-overlay" @click.self="!importando && emit('cerrar')" @keydown.esc="!importando && emit('cerrar')">
      <div class="mm-modal wide" role="dialog" aria-modal="true" aria-labelledby="importar-titulo" style="width: min(820px, 100%)">
        <div class="mm-modal-h">
          <div class="mm-ico brand"><MmIcon i="cloud-upload" :s="22" /></div>
          <div class="grow"><h2 id="importar-titulo" class="t-h2">Importar movimientos</h2><p class="t-sm muted">Desde el extracto de tu banco en CSV</p></div>
          <button type="button" class="mm-x" aria-label="Cerrar" :disabled="importando" @click="emit('cerrar')"><MmIcon i="close" :s="20" /></button>
        </div>

        <ol class="row gap-2" style="padding: 0 24px 16px; list-style: none; margin: 0" aria-label="Pasos">
          <template v-for="(p, i) in pasos" :key="p.n">
            <li v-if="i" class="grow" style="height: 2px; background: var(--line)" aria-hidden="true"></li>
            <li>
              <span class="mm-chip" :class="{'is-on': paso === p.n}" :aria-current="paso === p.n ? 'step' : null">
                <span class="mm-count" :style="paso > p.n ? 'background: var(--income)' : paso < p.n ? 'background: var(--ink-subtle)' : null">{{ p.n }}</span>{{ p.texto }}
              </span>
            </li>
          </template>
        </ol>

        <div class="mm-modal-b" style="min-height: 400px">
          <!-- 1 · Subir archivo -->
          <template v-if="paso === 1">
            <div
              class="mm-empty zona"
              :class="{activa: arrastrando}"
              @dragover.prevent="arrastrando = true"
              @dragleave="arrastrando = false"
              @drop.prevent="alSoltar"
            >
              <div class="art"><div class="mm-ico lg brand mm-float" style="width: 64px; height: 64px; border-radius: 20px"><MmIcon i="cloud-upload" :s="30" /></div></div>
              <h3 class="t-h3">Arrastra tu extracto aquí</h3>
              <p class="t-sm muted">CSV · hasta 5 MB y {{ MAX_FILAS }} filas · con fecha, descripción y monto</p>
              <button type="button" class="mm-btn" @click="entrada.click()">Buscar archivo</button>
              <input ref="entrada" type="file" accept=".csv,.txt,text/csv" class="mm-sr-only" aria-label="Archivo CSV" @change="cargarArchivo($event.target.files[0])" />
            </div>
            <div v-if="errorArchivo" class="mm-banner expense" role="alert"><MmIcon i="alert-circle" :s="18" /><span>{{ errorArchivo }}</span></div>
            <div v-if="archivo" class="mm-row" style="margin: 0; background: var(--income-tint)">
              <div class="mm-ico sm income"><MmIcon i="document-text" :s="18" /></div>
              <div class="grow"><div class="t">{{ archivo.nombre }}</div><div class="s">{{ csv.datos.length }} filas · {{ kb(archivo.bytes) }}</div></div>
              <span class="income"><MmIcon i="checkmark-circle" :s="20" /></span>
            </div>
          </template>

          <!-- 2 · Mapear columnas -->
          <template v-else-if="paso === 2">
            <div class="mm-banner" :class="mapeoCompleto ? 'info' : 'warn'">
              <MmIcon :i="mapeoCompleto ? 'sparkles' : 'warning'" :s="18" />
              <span v-if="mapeoRecordado">Usamos el mapeo que guardaste para este formato de extracto.</span>
              <span v-else-if="mapeoCompleto">Reconocimos las columnas del extracto y las mapeamos solas.</span>
              <span v-else>Mapeamos {{ columnasDetectadas }} de 3 columnas. Elige las que faltan.</span>
            </div>

            <div class="grid g2" style="gap: 12px">
              <div class="mm-field">
                <label for="imp-fecha">Fecha</label>
                <div class="mm-input mm-select" style="height: 42px"><select id="imp-fecha" v-model.number="mapeo.fecha"><option :value="-1" disabled>Elige una columna</option><option v-for="(h, i) in csv.encabezados" :key="i" :value="i">{{ h || `Columna ${i + 1}` }}</option></select></div>
              </div>
              <div class="mm-field">
                <label for="imp-desc">Descripción</label>
                <div class="mm-input mm-select" style="height: 42px"><select id="imp-desc" v-model.number="mapeo.descripcion"><option :value="-1" disabled>Elige una columna</option><option v-for="(h, i) in csv.encabezados" :key="i" :value="i">{{ h || `Columna ${i + 1}` }}</option></select></div>
              </div>
              <div class="mm-field">
                <label for="imp-monto">Monto <span class="muted" style="font-weight: 500">· negativo = gasto</span></label>
                <div class="mm-input mm-select" style="height: 42px"><select id="imp-monto" v-model.number="mapeo.monto"><option :value="-1" disabled>Elige una columna</option><option v-for="(h, i) in csv.encabezados" :key="i" :value="i">{{ h || `Columna ${i + 1}` }}</option></select></div>
              </div>
              <div class="mm-field">
                <label for="imp-cuenta">Cuenta destino</label>
                <div class="mm-input mm-select" style="height: 42px"><select id="imp-cuenta" v-model="destino.entidadId"><option v-for="c in cuentas" :key="c.id" :value="c.id">{{ c.nombre }}</option></select></div>
              </div>
              <div class="mm-field">
                <label for="imp-cat">Categoría para los que no reconocemos</label>
                <div class="mm-input mm-select" style="height: 42px"><select id="imp-cat" :value="destino.categoriaId" @change="elegirCategoria($event.target.value)"><option v-for="c in categorias" :key="c.value" :value="c.value">{{ c.label }}</option></select></div>
              </div>
              <div class="mm-field">
                <label for="imp-sub">Subcategoría</label>
                <div class="mm-input mm-select" style="height: 42px"><select id="imp-sub" v-model="destino.subcategoriaId"><option v-for="s in subcategorias" :key="s.value" :value="s.value">{{ s.label }}</option></select></div>
              </div>
            </div>

            <div v-if="mapeoCompleto" class="mm-card pad0 flat" style="overflow-x: auto">
              <table class="mm-table">
                <thead><tr><th>Fecha</th><th>Descripción</th><th>Categoría sugerida</th><th class="r">Monto</th></tr></thead>
                <tbody>
                  <tr v-for="f in resultado.filas.slice(0, 6)" :key="f.id" :style="f.duplicado ? 'background: var(--warning-tint)' : null">
                    <td>{{ fechaCorta(f.fecha) }}</td>
                    <td>{{ f.titulo }}</td>
                    <td>
                      <span v-if="f.duplicado" class="mm-badge warn"><MmIcon i="copy" :s="12" />Posible duplicado</span>
                      <span v-else class="mm-badge" :class="{warn: !f.sugerida}">{{ nombreCategoria((f.sugerida ?? destino).categoriaId) }}</span>
                    </td>
                    <td class="r"><span class="t-amt" :class="{income: f.monto > 0}">{{ f.monto < 0 ? "−" : "+" }} {{ moneda(Math.abs(f.monto), destino.divisaId) }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="mapeoCompleto && resultado.descartadas.length" class="mm-banner warn"><MmIcon i="warning" :s="18" /><span>{{ resultado.descartadas.length }} {{ resultado.descartadas.length === 1 ? "fila no tiene" : "filas no tienen" }} una fecha o un monto válido y se omitirá{{ resultado.descartadas.length === 1 ? "" : "n" }} (por ejemplo la fila {{ resultado.descartadas[0] }}).</span></div>
            <div v-if="resultado.recortado" class="mm-banner warn"><MmIcon i="warning" :s="18" /><span>Solo se leen las primeras {{ MAX_FILAS }} filas; importa el resto en otro archivo.</span></div>
          </template>

          <!-- 3 · Revisar y guardar -->
          <template v-else>
            <div class="grid g3" style="gap: 12px">
              <div class="mm-card flat"><div class="t-over">Se importan</div><div class="t-amt-lg">{{ aImportar.length }}</div><div class="t-xs muted">movimientos nuevos</div></div>
              <div class="mm-card flat"><div class="t-over">Se omiten</div><div class="t-amt-lg" style="color: var(--warning)">{{ duplicados.length }}</div><div class="t-xs muted">duplicados detectados</div></div>
              <div class="mm-card flat"><div class="t-over">Sin categoría</div><div class="t-amt-lg">{{ sinCategoria }}</div><div class="t-xs muted">quedan en {{ nombreCategoria(destino.categoriaId) }}</div></div>
            </div>
            <div class="row" style="gap: 12px">
              <input id="imp-recordar" v-model="recordar" type="checkbox" class="mm-sr-only" />
              <label for="imp-recordar" class="row t-sm" style="cursor: pointer; gap: 12px">
                <span class="mm-check" :class="{'is-on': recordar}"><MmIcon v-if="recordar" i="checkmark" :s="14" /></span>Recordar este mapeo para futuros extractos con las mismas columnas
              </label>
            </div>
            <div class="mm-banner income"><MmIcon i="checkmark-circle" :s="18" /><span>Al guardar, el saldo de {{ cuentas.find((c) => c.id === destino.entidadId)?.nombre }} se recalcula con los movimientos importados.</span></div>
            <div v-if="importando" class="col gap-2" role="status">
              <div class="mm-progress"><i :style="{'--w': `${Math.round((hechos / Math.max(1, aImportar.length)) * 100)}%`}"></i></div>
              <span class="t-xs muted">Importando {{ hechos }} de {{ aImportar.length }}…</span>
            </div>
          </template>
        </div>

        <div class="mm-modal-f" style="align-items: center">
          <span class="t-xs muted grow">{{ csv ? `${csv.datos.length} filas leídas${paso > 1 ? ` · ${duplicados.length} posibles duplicados` : ""}` : "Aún no has elegido un archivo" }}</span>
          <button type="button" class="mm-btn ghost" :disabled="importando" @click="paso > 1 ? paso-- : emit('cerrar')">{{ paso > 1 ? "Atrás" : "Cancelar" }}</button>
          <button type="button" class="mm-btn primary" :class="{'is-loading': importando}" :disabled="!puedeContinuar" @click="siguiente">
            {{ paso === 3 ? `Importar ${aImportar.length} movimientos` : "Continuar" }}<MmIcon i="arrow-forward" :s="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.zona {
  border: 2px dashed var(--line-strong);
  border-radius: 18px;
  padding: 40px;
  background: var(--surface-2);
  transition: border-color var(--dur-fast), background var(--dur-fast);
}
.zona.activa {
  border-color: var(--brand-strong);
  background: var(--brand-tint);
}
</style>
