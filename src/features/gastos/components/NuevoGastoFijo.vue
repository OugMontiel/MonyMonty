<script setup>
/**
 * Modal "Nuevo gasto fijo". La API no tiene un recurso de gastos programados: un fijo es un gasto
 * (EGRESO) marcado como recurrente, así que aquí se registra su cobro real (hoy o uno ya pasado) y
 * desde ahí el día del mes queda como el día de cobro en Fijos y suscripciones.
 */
import {ref, reactive, computed, onMounted, nextTick} from "vue";

import MmIcon from "@/components/mm/MmIcon.vue";
import MmSelect from "@/components/mm/MmSelect.vue";
import {useAvisos} from "@/composables/useAvisos.js";
import {iconoDe, moneda, parseLabelEntidad, formatearMontoTexto, leerMontoTexto, TIPOS_ENTIDAD, ENTIDAD_GENERICA} from "@/features/dashBoard/logic/formato.js";
import {useMovimientos} from "@/features/movimientos/logic/CreateMovimiento.js";
import {useMovimientoOptions} from "@/features/movimientos/logic/OptionsMovimiento.js";
import {aInputFecha} from "@/features/movimientos/logic/filtrosMovimientos.js";
import {useReportes} from "@/features/reportes/logic/useReportes.js";
import {detectarFijos, resumenDeFijos} from "../logic/fijos.js";

const emit = defineEmits(["cerrar"]);

const {mostrar} = useAvisos();
const {createMovimiento, loading: guardando} = useMovimientos();
const {entidades, categorias, fetchOptions} = useMovimientoOptions();
const {movimientos, divisa, hoy} = useReportes();

const form = reactive({titulo: "", montoTexto: "", categoriaId: "", entidadId: "", fecha: aInputFecha(hoy)});
const intentado = ref(false);
const campoNombre = ref(null);

const monto = computed(() => leerMontoTexto(form.montoTexto));
const decimales = computed(() => !["COP", "CLP", "PYG", "JPY"].includes(divisa.value));
const dinero = (v) => moneda(v, divisa.value);

// ---------- Opciones (mismas fuentes que el formulario de movimientos) ----------
const opcionesCategoria = computed(() =>
  categorias.value.map((c) => {
    const ejemplo = movimientos.value.find((m) => m.categoriaId === c.value)?.categoria;
    return {value: c.value, label: c.label, color: ejemplo?.color ?? "var(--cat-slate)", icono: iconoDe(ejemplo?.icono)};
  })
);
const opcionesCuenta = computed(() =>
  entidades.value.map((e) => {
    const d = parseLabelEntidad(e.label);
    const t = TIPOS_ENTIDAD[d.tipo] ?? ENTIDAD_GENERICA;
    return {value: e.value, label: d.nombre, detalle: d.numero ? `${t.etiqueta} · ${d.numero}` : t.etiqueta, icono: t.icono, color: t.color};
  })
);

// ---------- Validación ----------
const errores = computed(() => {
  const e = {};
  if (!form.titulo.trim()) e.titulo = "Ponle un nombre, por ejemplo Arriendo o Netflix.";
  if (!(monto.value > 0)) e.monto = "Escribe cuánto cuesta cada mes.";
  if (!form.categoriaId) e.categoria = "Elige una categoría.";
  if (!form.entidadId) e.entidad = "Elige con qué cuenta se paga.";
  if (!form.fecha) e.fecha = "Elige la fecha del cobro.";
  else if (form.fecha > aInputFecha(hoy)) e.fecha = "El cobro ya debe haber ocurrido; no se programan cobros futuros.";
  return e;
});
const verError = (campo) => (intentado.value ? errores.value[campo] : "");

const diaDeCobro = computed(() => (form.fecha ? Number(form.fecha.slice(8, 10)) : null));

// ---------- Cuánto suben los fijos con este ----------
const proyeccion = computed(() => {
  const actuales = detectarFijos(movimientos.value, hoy);
  const base = resumenDeFijos(actuales, movimientos.value, hoy);
  const total = base.total + (monto.value > 0 ? monto.value : 0);
  const ingresoMensual = base.pctIngresos ? base.total / (base.pctIngresos / 100) : 0;
  return {total, pct: ingresoMensual > 0 ? Math.round((total / ingresoMensual) * 100) : null};
});

function alEscribirMonto(e) {
  form.montoTexto = formatearMontoTexto(e.target.value, decimales.value);
  e.target.value = form.montoTexto;
}

/** La fecha elegida al mediodía (evita saltos de día por zona horaria), o la hora actual si es hoy */
function fechaISO() {
  if (form.fecha === aInputFecha(new Date())) return new Date().toISOString();
  const [y, m, d] = form.fecha.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0).toISOString();
}

async function guardar() {
  intentado.value = true;
  if (Object.keys(errores.value).length) return;
  const subcategorias = categorias.value.find((c) => c.value === form.categoriaId)?.subcategorias ?? [];
  try {
    await createMovimiento({
      tipo: "EGRESO",
      monto: monto.value,
      fecha: fechaISO(),
      divisaId: divisa.value,
      categoriaId: form.categoriaId,
      subcategoriaId: subcategorias[0]?.value ?? "",
      entidadId: form.entidadId,
      concepto: {titulo: form.titulo.trim(), detalle: ""},
      tags: [],
      esRecurrente: true,
      origen: "MANUAL",
      estado: "COMPLETADO",
    });
    mostrar({titulo: "Gasto fijo guardado", detalle: `${form.titulo.trim()} · ${dinero(monto.value)} el día ${diaDeCobro.value} de cada mes`});
    emit("cerrar");
  } catch (err) {
    mostrar({tono: "expense", icono: "alert-circle", titulo: "No se pudo guardar", detalle: err.response?.data?.message || "Inténtalo de nuevo."});
  }
}

onMounted(async () => {
  await fetchOptions();
  // Lo último que se usó como valor inicial: la categoría y la cuenta del gasto más reciente
  const ultimo = movimientos.value.find((m) => m.tipo === "EGRESO" && !m.esSistema && m.categoriaId);
  form.categoriaId = categorias.value.some((c) => c.value === ultimo?.categoriaId) ? ultimo.categoriaId : (categorias.value[0]?.value ?? "");
  form.entidadId = entidades.value.some((e) => e.value === ultimo?.entidadId) ? ultimo.entidadId : (entidades.value[0]?.value ?? "");
  await nextTick();
  campoNombre.value?.focus();
});

function alTeclear(e) {
  if (e.key === "Escape") emit("cerrar");
  else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    guardar();
  }
}
</script>

<template>
  <div class="mm-root" data-theme="light">
    <div class="mm-overlay" @click.self="emit('cerrar')">
      <div class="mm-modal" role="dialog" aria-modal="true" aria-labelledby="fijo-titulo" style="width: min(580px, 100%)" @keydown="alTeclear">
        <div class="mm-modal-h">
          <div class="mm-ico expense"><MmIcon i="calendar" :s="22" /></div>
          <div class="grow"><h2 id="fijo-titulo" class="t-h2">Nuevo gasto fijo</h2><p class="t-sm muted">Arriendo, servicios, suscripciones o cuotas</p></div>
          <button type="button" class="mm-x" aria-label="Cerrar" @click="emit('cerrar')"><MmIcon i="close" :s="20" /></button>
        </div>

        <div class="mm-modal-b">
          <div class="grid g2" style="gap: 16px">
            <div class="mm-field">
              <label for="fijo-nombre">Nombre</label>
              <div class="mm-input" :class="{'is-error': verError('titulo')}"><MmIcon i="pricetags" :s="18" /><input id="fijo-nombre" ref="campoNombre" v-model="form.titulo" placeholder="Ej: Netflix" maxlength="80" /></div>
              <span v-if="verError('titulo')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("titulo") }}</span>
            </div>
            <div class="mm-field">
              <label for="fijo-monto">Monto</label>
              <div class="mm-input" :class="{'is-error': verError('monto')}"><span class="muted">$</span><input id="fijo-monto" :value="form.montoTexto" inputmode="decimal" placeholder="0" @input="alEscribirMonto" /><span class="mm-badge">{{ divisa }}</span></div>
              <span v-if="verError('monto')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("monto") }}</span>
            </div>
          </div>

          <div class="grid g2" style="gap: 16px">
            <div class="mm-field">
              <label for="fijo-categoria">Categoría</label>
              <MmSelect id="fijo-categoria" v-model="form.categoriaId" :options="opcionesCategoria" placeholder="Elige una categoría" :invalid="Boolean(verError('categoria'))" />
              <span v-if="verError('categoria')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("categoria") }}</span>
            </div>
            <div class="mm-field">
              <label for="fijo-cuenta">Se paga con</label>
              <MmSelect id="fijo-cuenta" v-model="form.entidadId" :options="opcionesCuenta" icono="card" placeholder="Elige una cuenta" :invalid="Boolean(verError('entidad'))" />
              <span v-if="verError('entidad')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("entidad") }}</span>
            </div>
          </div>

          <div class="mm-field">
            <label for="fijo-fecha">Fecha del cobro</label>
            <div class="mm-input" :class="{'is-error': verError('fecha')}"><MmIcon i="calendar" :s="18" /><input id="fijo-fecha" v-model="form.fecha" type="date" :max="aInputFecha(hoy)" /></div>
            <span v-if="verError('fecha')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("fecha") }}</span>
            <span v-else class="t-xs muted">Se registra este cobro y cada mes lo verás pendiente el día {{ diaDeCobro ?? "…" }}.</span>
          </div>

          <div class="mm-banner info">
            <MmIcon i="information-circle" :s="18" />
            <span class="t-sm">Con este, tus fijos suben a <b>{{ dinero(proyeccion.total) }}</b> al mes<template v-if="proyeccion.pct !== null"> ({{ proyeccion.pct }} % de tus ingresos)</template>.</span>
          </div>
        </div>

        <div class="mm-modal-f">
          <button type="button" class="mm-btn ghost" @click="emit('cerrar')">Cancelar</button>
          <button type="button" class="mm-btn primary" :class="{'is-loading': guardando}" :disabled="guardando" @click="guardar"><MmIcon i="checkmark" :s="18" />Guardar gasto fijo</button>
        </div>
      </div>
    </div>
  </div>
</template>
