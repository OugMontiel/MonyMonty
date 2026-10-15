<script setup>
/**
 * Formulario de movimiento (modal). Registra un gasto (EGRESO) o un ingreso (INGRESO) con
 * POST movimiento; los campos son los de la API: tipo, monto, divisaId, categoriaId,
 * subcategoriaId, entidadId, fecha, concepto {titulo, detalle}, tags y esRecurrente.
 */
import {ref, reactive, computed, watch, onMounted, nextTick} from "vue";
import {useToast} from "primevue/usetoast";

import MmIcon from "@/components/mm/MmIcon.vue";
import {useTablero} from "@/features/dashBoard/logic/useTablero.js";
import {iconoDe, parseLabelEntidad, formatearMontoTexto, leerMontoTexto, montoATexto} from "@/features/dashBoard/logic/formato.js";
import {useMovimientos} from "../logic/CreateMovimiento.js";
import {useMovimientoOptions} from "../logic/OptionsMovimiento.js";
import {movimientos} from "../logic/movimientosStore.js";
import {aInputFecha} from "../logic/filtrosMovimientos.js";

const props = defineProps({
  // Con "id" se edita ese movimiento; sin él se crea uno nuevo
  id: {type: String, default: null},
});
const emit = defineEmits(["cerrar", "guardado"]);

const toast = useToast();
const {createMovimiento, loading: guardando} = useMovimientos();
const {entidades, categorias, divisas, fetchOptions} = useMovimientoOptions();
const {divisaPrincipal} = useTablero();

const TIPOS = [
  {id: "EGRESO", etiqueta: "Gasto", icono: "arrow-down", tono: "expense", guardar: "Guardar gasto", marcador: "Ej: Almuerzo, mercado, gasolina…", cuenta: "Sale de"},
  {id: "INGRESO", etiqueta: "Ingreso", icono: "arrow-up", tono: "income", guardar: "Guardar ingreso", marcador: "Ej: Pago cliente, salario…", cuenta: "Entra a"},
];

const form = reactive({
  tipo: "EGRESO",
  montoTexto: "",
  divisaId: "COP",
  categoriaId: "",
  subcategoriaId: "",
  entidadId: "",
  fecha: aInputFecha(new Date()),
  titulo: "",
  detalle: "",
  esRecurrente: false,
  etiquetas: "",
});
const intentado = ref(false);
const masOpciones = ref(false);
const modal = ref(null);
const campoMonto = ref(null);

const tipoActual = computed(() => TIPOS.find((t) => t.id === form.tipo));
const indiceTipo = computed(() => TIPOS.findIndex((t) => t.id === form.tipo));
const decimales = computed(() => !["COP", "CLP", "PYG", "JPY"].includes(form.divisaId));
const monto = computed(() => leerMontoTexto(form.montoTexto));

// ---------- Opciones de la API ----------
// GET entidad solo trae una etiqueta "TIPO - nombre - número"
const cuentas = computed(() =>
  entidades.value.map((e) => {
    const d = parseLabelEntidad(e.label);
    return {id: e.value, texto: d.numero ? `${d.nombre} •••• ${d.numero}` : d.nombre};
  })
);
const categoriaActual = computed(() => categorias.value.find((c) => c.value === form.categoriaId));
const subcategorias = computed(() => categoriaActual.value?.subcategorias ?? []);
const colorCategoria = computed(() => movimientos.value.find((m) => m.categoriaId === form.categoriaId)?.categoria?.color ?? "var(--cat-slate)");
const iconoCategoria = computed(() => iconoDe(movimientos.value.find((m) => m.categoriaId === form.categoriaId)?.categoria?.icono));

/** Últimas categorías usadas con este tipo, para elegirlas de un toque */
const recientes = computed(() => {
  const vistos = new Set();
  const lista = [];
  for (const m of movimientos.value) {
    if (m.tipo !== form.tipo || m.esSistema || !m.categoriaId || vistos.has(m.categoriaId)) continue;
    if (!categorias.value.some((c) => c.value === m.categoriaId)) continue;
    vistos.add(m.categoriaId);
    lista.push({categoriaId: m.categoriaId, subcategoriaId: m.subcategoriaId, nombre: m.categoria?.categoria});
    if (lista.length === 3) break;
  }
  return lista;
});

function elegirCategoria(categoriaId, subcategoriaId = "") {
  form.categoriaId = categoriaId;
  const subs = categorias.value.find((c) => c.value === categoriaId)?.subcategorias ?? [];
  form.subcategoriaId = subs.some((s) => s.value === subcategoriaId) ? subcategoriaId : (subs[0]?.value ?? "");
}

/** Preselecciona categoría y cuenta con lo último que se usó para este tipo */
function aplicarPorDefecto() {
  const ultimo = movimientos.value.find((m) => m.tipo === form.tipo && !m.esSistema && m.categoriaId);
  const cat = categorias.value.some((c) => c.value === ultimo?.categoriaId) ? ultimo : null;
  elegirCategoria(cat?.categoriaId ?? categorias.value[0]?.value ?? "", cat?.subcategoriaId);
  if (!cuentas.value.some((c) => c.id === form.entidadId)) {
    form.entidadId = cuentas.value.some((c) => c.id === ultimo?.entidadId) ? ultimo.entidadId : (cuentas.value[0]?.id ?? "");
  }
}

function cambiarTipo(id) {
  if (form.tipo === id) return;
  form.tipo = id;
  aplicarPorDefecto();
}

watch(() => form.categoriaId, (id, anterior) => {
  // Si la categoría cambió desde el selector, la subcategoría debe pertenecer a la nueva
  if (id !== anterior && !subcategorias.value.some((s) => s.value === form.subcategoriaId)) form.subcategoriaId = subcategorias.value[0]?.value ?? "";
});

watch(() => form.divisaId, () => {
  // Al pasar a una divisa sin decimales se descartan los de lo que ya estaba escrito
  form.montoTexto = formatearMontoTexto(form.montoTexto, decimales.value);
});

function alEscribirMonto(e) {
  form.montoTexto = formatearMontoTexto(e.target.value, decimales.value);
  e.target.value = form.montoTexto;
}

onMounted(async () => {
  await fetchOptions();
  form.divisaId = divisas.value.some((d) => d.value === divisaPrincipal.value) ? divisaPrincipal.value : (divisas.value[0]?.value ?? "COP");
  aplicarPorDefecto();
  await nextTick();
  campoMonto.value?.focus();
});

// ---------- Validación ----------
const errores = computed(() => {
  const e = {};
  if (!(monto.value > 0)) e.monto = "Escribe un monto mayor a 0";
  if (!form.entidadId) e.entidadId = "Elige una cuenta";
  if (!form.categoriaId) e.categoriaId = "Elige una categoría";
  else if (!form.subcategoriaId) e.subcategoriaId = "Elige una subcategoría";
  if (!form.fecha) e.fecha = "Elige una fecha";
  return e;
});
const verError = (campo) => (intentado.value ? errores.value[campo] : "");

// ---------- Guardado ----------
/** La fecha elegida con la hora actual si es hoy, o al mediodía si es otro día (evita saltos por zona horaria) */
function fechaISO() {
  const hoy = aInputFecha(new Date());
  if (form.fecha === hoy) return new Date().toISOString();
  const [y, m, d] = form.fecha.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0).toISOString();
}

function armarPayload() {
  return {
    tipo: form.tipo,
    monto: monto.value,
    fecha: fechaISO(),
    divisaId: form.divisaId,
    categoriaId: form.categoriaId,
    subcategoriaId: form.subcategoriaId,
    entidadId: form.entidadId,
    concepto: {titulo: form.titulo.trim(), detalle: form.detalle.trim()},
    tags: form.etiquetas.split(",").map((t) => t.trim()).filter(Boolean),
    esRecurrente: form.esRecurrente,
    origen: "MANUAL",
    estado: "COMPLETADO",
  };
}

async function guardar({crearOtro = false} = {}) {
  intentado.value = true;
  if (Object.keys(errores.value).length) return;

  try {
    await createMovimiento(armarPayload());
    toast.add({severity: "success", summary: tipoActual.value.etiqueta === "Gasto" ? "Gasto guardado" : "Ingreso guardado", detail: `${form.titulo.trim() || categoriaActual.value?.label}`, life: 3000});
    emit("guardado");

    if (crearOtro) {
      // Se conservan tipo, cuenta y categoría; solo se limpia lo que cambia de un movimiento a otro
      form.montoTexto = "";
      form.titulo = "";
      form.detalle = "";
      intentado.value = false;
      await nextTick();
      campoMonto.value?.focus();
    } else {
      emit("cerrar");
    }
  } catch (err) {
    toast.add({severity: "error", summary: "No se pudo guardar", detail: err.response?.data?.message || "Inténtalo de nuevo.", life: 4000});
  }
}

function alTeclear(e) {
  if (e.key === "Escape") emit("cerrar");
  else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    guardar({crearOtro: true});
  }
}
</script>

<template>
  <div class="mm-root" data-theme="light">
    <div class="mm-overlay" @click.self="emit('cerrar')" @keydown="alTeclear">
      <form ref="modal" class="mm-modal" role="dialog" aria-modal="true" aria-labelledby="mov-titulo" novalidate @submit.prevent="guardar()">
        <div class="mm-modal-h">
          <div class="grow"><h2 id="mov-titulo" class="t-h2">Nuevo movimiento</h2><p class="t-sm muted">Registra en segundos</p></div>
          <button type="button" class="mm-x" aria-label="Cerrar" @click="emit('cerrar')"><MmIcon i="close" :s="20" /></button>
        </div>

        <div class="mm-modal-b">
          <div class="mm-seg typed lg" role="group" aria-label="Tipo de movimiento" :data-v="indiceTipo" :style="{'--n': TIPOS.length, '--on': indiceTipo, width: '100%'}">
            <i class="thumb"></i>
            <button v-for="t in TIPOS" :key="t.id" type="button" :class="{'is-on': form.tipo === t.id}" :aria-pressed="form.tipo === t.id" @click="cambiarTipo(t.id)"><MmIcon :i="t.icono" :s="14" />{{ t.etiqueta }}</button>
          </div>

          <div class="mm-field">
            <label for="mov-monto">Monto</label>
            <div class="mm-input amount" :class="[tipoActual.tono, {'is-error': verError('monto')}]">
              <span class="muted" style="font-size: 22px">$</span>
              <input id="mov-monto" ref="campoMonto" :value="form.montoTexto" inputmode="decimal" placeholder="0" autocomplete="off" style="font-size: 32px; color: inherit" :aria-invalid="Boolean(verError('monto'))" @input="alEscribirMonto" />
              <select v-model="form.divisaId" class="divisa" aria-label="Divisa">
                <option v-for="d in divisas" :key="d.value" :value="d.value">{{ d.value }}</option>
              </select>
            </div>
            <span v-if="verError('monto')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("monto") }}</span>
          </div>

          <div class="grid g2" style="gap: 16px">
            <div class="mm-field">
              <label for="mov-categoria">Categoría</label>
              <div class="mm-input mm-select" :class="{'is-error': verError('categoriaId')}">
                <span class="mm-ico cat" :style="{width: '26px', height: '26px', borderRadius: '8px', background: colorCategoria}"><MmIcon :i="iconoCategoria" :s="14" /></span>
                <select id="mov-categoria" :value="form.categoriaId" @change="elegirCategoria($event.target.value)">
                  <option v-for="c in categorias" :key="c.value" :value="c.value">{{ c.label }}</option>
                </select>
              </div>
              <span v-if="verError('categoriaId')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("categoriaId") }}</span>
            </div>
            <div class="mm-field">
              <label for="mov-subcategoria">Subcategoría</label>
              <div class="mm-input mm-select" :class="{'is-error': verError('subcategoriaId')}">
                <select id="mov-subcategoria" v-model="form.subcategoriaId">
                  <option v-if="!subcategorias.length" value="">Sin subcategorías</option>
                  <option v-for="s in subcategorias" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
              </div>
              <span v-if="verError('subcategoriaId')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("subcategoriaId") }}</span>
            </div>
          </div>

          <div v-if="recientes.length" class="row" style="flex-wrap: wrap; gap: 6px">
            <span class="t-xs muted">Recientes:</span>
            <button v-for="r in recientes" :key="r.categoriaId" type="button" class="mm-chip" style="height: 28px" :class="{'is-on': form.categoriaId === r.categoriaId}" @click="elegirCategoria(r.categoriaId, r.subcategoriaId)">{{ r.nombre }}</button>
          </div>

          <div class="grid g2" style="gap: 16px">
            <div class="mm-field">
              <label for="mov-cuenta">{{ tipoActual.cuenta }}</label>
              <div class="mm-input mm-select" :class="{'is-error': verError('entidadId')}">
                <MmIcon i="wallet" :s="18" />
                <select id="mov-cuenta" v-model="form.entidadId">
                  <option v-if="!cuentas.length" value="">Aún no tienes cuentas</option>
                  <option v-for="c in cuentas" :key="c.id" :value="c.id">{{ c.texto }}</option>
                </select>
              </div>
              <span v-if="verError('entidadId')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("entidadId") }}</span>
            </div>
            <div class="mm-field">
              <label for="mov-fecha">Fecha</label>
              <div class="mm-input" :class="{'is-error': verError('fecha')}">
                <MmIcon i="calendar" :s="18" />
                <input id="mov-fecha" v-model="form.fecha" type="date" />
              </div>
              <span v-if="verError('fecha')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("fecha") }}</span>
            </div>
          </div>

          <div class="mm-field">
            <label for="mov-titulo-concepto">Descripción <span class="muted" style="font-weight: 500">· opcional</span></label>
            <div class="mm-input"><input id="mov-titulo-concepto" v-model="form.titulo" :placeholder="tipoActual.marcador" maxlength="80" /></div>
          </div>

          <button type="button" class="row gap-1 t-sm mas-opciones" :aria-expanded="masOpciones" @click="masOpciones = !masOpciones">
            <MmIcon :i="masOpciones ? 'chevron-up' : 'chevron-down'" :s="14" />Más opciones: nota, repetir y etiquetas
          </button>
          <template v-if="masOpciones">
            <div class="mm-field">
              <label for="mov-nota">Nota</label>
              <div class="mm-input area"><textarea id="mov-nota" v-model="form.detalle" rows="2" maxlength="300"></textarea></div>
            </div>
            <div class="mm-field">
              <label for="mov-etiquetas">Etiquetas <span class="muted" style="font-weight: 500">· separadas por coma</span></label>
              <div class="mm-input"><input id="mov-etiquetas" v-model="form.etiquetas" placeholder="Ej: trabajo, viaje" /></div>
            </div>
            <div class="row gap-3">
              <button type="button" class="mm-toggle" :class="{'is-on': form.esRecurrente}" role="switch" :aria-checked="form.esRecurrente" aria-label="Se repite" @click="form.esRecurrente = !form.esRecurrente"></button>
              <span class="t-sm">Este movimiento se repite</span>
            </div>
          </template>
        </div>

        <div class="mm-modal-f" style="align-items: center">
          <span class="t-xs muted grow row gap-1 mm-only-desktop" style="white-space: nowrap"><span class="mm-kbd">Ctrl</span>+<span class="mm-kbd">Enter</span>guarda y crea otro</span>
          <button type="button" class="mm-btn ghost" @click="emit('cerrar')">Cancelar</button>
          <button type="submit" class="mm-btn primary" :class="{'is-loading': guardando}" :disabled="guardando"><MmIcon i="checkmark" :s="18" />{{ tipoActual.guardar }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.divisa {
  all: unset;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--surface-3);
  color: var(--ink);
  cursor: pointer;
}
.divisa option {
  color: #2f2f2f;
  background: #fff;
}
.mas-opciones {
  border: 0;
  background: none;
  padding: 0;
  color: var(--brand-ink);
  font-weight: 700;
  align-self: flex-start;
}
</style>
