<script setup>
/**
 * Formulario de movimiento (modal) para crear (POST movimiento) o, con `id`, editar (PUT movimiento/:id).
 * Registra un gasto (EGRESO), un ingreso (INGRESO) o una
 * transferencia entre cuentas (TRANSFERENCIA) con POST movimiento; los campos son los de la API:
 * tipo, monto, divisaId, categoriaId, subcategoriaId, entidadId, transferencia {origenEntidadId,
 * destinoEntidadId}, fecha, concepto {titulo, detalle}, tags y esRecurrente.
 */
import {ref, reactive, computed, watch, onMounted, nextTick} from "vue";

import {useAvisos} from "@/composables/useAvisos.js";
import MmIcon from "@/components/mm/MmIcon.vue";
import {useTablero} from "@/features/dashBoard/logic/useTablero.js";
import {iconoDe, moneda, fechaCorta, colorMovimiento, iconoMovimiento, parseLabelEntidad, formatearMontoTexto, leerMontoTexto, montoATexto, TIPOS_ENTIDAD, ENTIDAD_GENERICA} from "@/features/dashBoard/logic/formato.js";
import {useMovimientos} from "../logic/CreateMovimiento.js";
import {useMovimientoOptions} from "../logic/OptionsMovimiento.js";
import {movimientos, movimientoResaltado, ultimoGuardado} from "../logic/movimientosStore.js";
import {aInputFecha} from "../logic/filtrosMovimientos.js";

const props = defineProps({
  // Con "id" se edita ese movimiento; sin él se crea uno nuevo
  id: {type: String, default: null},
});
const emit = defineEmits(["cerrar", "guardado", "eliminar"]);

const {mostrar} = useAvisos();
const {createMovimiento, updateMovimiento, getMovimiento, deleteMovimiento, loading: guardando} = useMovimientos();
const {entidades, categorias, divisas, fetchOptions} = useMovimientoOptions();
const {divisaPrincipal, cuentas: cuentasConSaldo} = useTablero();

const TIPOS = [
  {id: "EGRESO", etiqueta: "Gasto", icono: "arrow-down", tono: "expense", guardar: "Guardar gasto", marcador: "Ej: Almuerzo, mercado, gasolina…", cuenta: "Sale de"},
  {id: "INGRESO", etiqueta: "Ingreso", icono: "arrow-up", tono: "income", guardar: "Guardar ingreso", marcador: "Ej: Pago cliente, salario…", cuenta: "Entra a"},
  {id: "TRANSFERENCIA", etiqueta: "Transferencia", icono: "swap-horizontal", tono: "info", guardar: "Transferir", marcador: "Ej: Recarga para la semana", cuenta: ""},
];

const form = reactive({
  tipo: "EGRESO",
  montoTexto: "",
  divisaId: "COP",
  categoriaId: "",
  subcategoriaId: "",
  entidadId: "",
  origenId: "",
  destinoId: "",
  fecha: aInputFecha(new Date()),
  titulo: "",
  detalle: "",
  esRecurrente: false,
  etiquetas: "",
});
const intentado = ref(false);
const editando = computed(() => Boolean(props.id));
// Al editar: el movimiento tal como llegó de la API y una copia del formulario para detectar cambios
const original = ref(null);
const instantanea = ref("");
const cargandoMov = ref(false);
const errorCarga = ref("");
const masOpciones = ref(false);
const modal = ref(null);
const campoMonto = ref(null);

const tipoActual = computed(() => TIPOS.find((t) => t.id === form.tipo));
const indiceTipo = computed(() => TIPOS.findIndex((t) => t.id === form.tipo));
const decimales = computed(() => !["COP", "CLP", "PYG", "JPY"].includes(form.divisaId));
const monto = computed(() => leerMontoTexto(form.montoTexto));
const esTransferencia = computed(() => form.tipo === "TRANSFERENCIA");

// ---------- Opciones de la API ----------
// GET entidad solo trae una etiqueta "TIPO - nombre - número"
const cuentas = computed(() =>
  entidades.value.map((e) => {
    const d = parseLabelEntidad(e.label);
    return {id: e.value, nombre: d.nombre, texto: d.numero ? `${d.nombre} •••• ${d.numero}` : d.nombre};
  })
);
/** Datos de una cuenta para las tarjetas Desde / Hacia (nombre, tipo, icono y saldo si se conoce) */
const infoCuenta = (id) => {
  const c = cuentasConSaldo.value.find((x) => x.id === id);
  const t = TIPOS_ENTIDAD[c?.tipo] ?? ENTIDAD_GENERICA;
  const base = cuentas.value.find((x) => x.id === id);
  return {nombre: c?.nombre ?? base?.texto ?? "—", detalle: c ? (c.numero ? `${t.etiqueta} · ${c.numero}` : t.etiqueta) : "", icono: t.icono, color: t.color, saldo: c?.saldo ?? null};
};
const origen = computed(() => infoCuenta(form.origenId));
const destino = computed(() => infoCuenta(form.destinoId));
const dinero = (v) => moneda(v, form.divisaId);
const saldoTotal = computed(() => cuentasConSaldo.value.reduce((s, c) => s + c.saldo, 0));

function intercambiarCuentas() {
  [form.origenId, form.destinoId] = [form.destinoId, form.origenId];
}

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

function cuentasPorDefecto() {
  if (!cuentas.value.some((c) => c.id === form.origenId)) form.origenId = cuentas.value[0]?.id ?? "";
  if (!cuentas.value.some((c) => c.id === form.destinoId) || form.destinoId === form.origenId) form.destinoId = cuentas.value.find((c) => c.id !== form.origenId)?.id ?? "";
}

function cambiarTipo(id) {
  if (form.tipo === id) return;
  form.tipo = id;
  if (id === "TRANSFERENCIA") cuentasPorDefecto();
  else aplicarPorDefecto();
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

/** Llena el formulario con un movimiento existente */
function precargar(m) {
  form.tipo = m.tipo;
  form.divisaId = m.divisaId;
  form.montoTexto = montoATexto(m.monto, !["COP", "CLP", "PYG", "JPY"].includes(m.divisaId));
  form.fecha = aInputFecha(new Date(m.fecha));
  form.titulo = m.concepto?.titulo ?? "";
  form.detalle = m.concepto?.detalle ?? "";
  form.esRecurrente = Boolean(m.esRecurrente);
  form.etiquetas = (m.tags ?? []).join(", ");
  if (m.tipo === "TRANSFERENCIA") {
    form.origenId = m.transferencia?.origenEntidadId ?? "";
    form.destinoId = m.transferencia?.destinoEntidadId ?? "";
  } else {
    form.entidadId = m.entidadId ?? "";
    form.categoriaId = m.categoriaId ?? "";
    form.subcategoriaId = m.subcategoriaId ?? "";
  }
  masOpciones.value = Boolean(form.detalle || form.etiquetas || form.esRecurrente);
}

const instantaneaActual = () => JSON.stringify(form);

onMounted(async () => {
  await fetchOptions();

  if (editando.value) {
    cargandoMov.value = true;
    try {
      original.value = (await getMovimiento(props.id)).data;
      precargar(original.value);
      await nextTick();
      instantanea.value = instantaneaActual();
    } catch (err) {
      errorCarga.value = err.response?.data?.message || "No pudimos cargar este movimiento.";
    } finally {
      cargandoMov.value = false;
    }
  } else {
    form.divisaId = divisas.value.some((d) => d.value === divisaPrincipal.value) ? divisaPrincipal.value : (divisas.value[0]?.value ?? "COP");
    aplicarPorDefecto();
    cuentasPorDefecto();
  }
  await nextTick();
  campoMonto.value?.focus();
});

// ---------- Cambios sin guardar (solo al editar) ----------
const hayCambios = computed(() => editando.value && instantanea.value !== "" && instantaneaActual() !== instantanea.value);

function descartarCambios() {
  precargar(original.value);
  intentado.value = false;
}

const montoAnterior = computed(() => (editando.value && original.value && original.value.monto !== monto.value ? moneda(original.value.monto, original.value.divisaId) : ""));

// ---------- Validación ----------
const errores = computed(() => {
  const e = {};
  if (!(monto.value > 0)) e.monto = "Escribe un monto mayor a 0";
  if (esTransferencia.value) {
    if (!form.origenId) e.origenId = "Elige la cuenta de origen";
    if (!form.destinoId) e.destinoId = "Elige la cuenta de destino";
    else if (form.destinoId === form.origenId) e.destinoId = "El origen y el destino no pueden ser la misma cuenta";
  } else {
    if (!form.entidadId) e.entidadId = "Elige una cuenta";
    if (!form.categoriaId) e.categoriaId = "Elige una categoría";
    else if (!form.subcategoriaId) e.subcategoriaId = "Elige una subcategoría";
  }
  if (!form.fecha) e.fecha = "Elige una fecha";
  return e;
});
const verError = (campo) => (intentado.value ? errores.value[campo] : "");

// ---------- Guardado ----------
/** La fecha elegida con la hora actual si es hoy, o al mediodía si es otro día (evita saltos por zona horaria) */
function fechaISO() {
  // Al editar sin tocar el día se conserva la hora original
  if (editando.value && original.value && form.fecha === aInputFecha(new Date(original.value.fecha))) return new Date(original.value.fecha).toISOString();
  const hoy = aInputFecha(new Date());
  if (form.fecha === hoy) return new Date().toISOString();
  const [y, m, d] = form.fecha.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0).toISOString();
}

function armarPayload() {
  // Una transferencia no lleva categoría ni cuenta única: va de un origen a un destino
  const cuenta = esTransferencia.value
    ? {transferencia: {origenEntidadId: form.origenId, destinoEntidadId: form.destinoId}}
    : {categoriaId: form.categoriaId, subcategoriaId: form.subcategoriaId, entidadId: form.entidadId};
  return {
    tipo: form.tipo,
    monto: monto.value,
    fecha: fechaISO(),
    divisaId: form.divisaId,
    ...cuenta,
    concepto: {titulo: form.titulo.trim(), detalle: form.detalle.trim()},
    tags: form.etiquetas.split(",").map((t) => t.trim()).filter(Boolean),
    esRecurrente: form.esRecurrente,
    origen: "MANUAL",
    estado: "COMPLETADO",
  };
}

/** Texto corto de lo que se guardó, para el aviso: "Comida · − $ 48.900 desde Nequi" */
function resumenGuardado() {
  const importe = dinero(monto.value);
  if (esTransferencia.value) return `${origen.value.nombre} → ${destino.value.nombre} · ${importe}`;
  const cuenta = cuentas.value.find((c) => c.id === form.entidadId)?.nombre ?? "";
  const signo = form.tipo === "EGRESO" ? "−" : "+";
  return `${categoriaActual.value?.label ?? ""} · ${signo} ${importe}${cuenta ? (form.tipo === "EGRESO" ? " desde " : " en ") + cuenta : ""}`;
}

/** Deshace un movimiento recién creado (lo elimina) */
async function deshacer(idCreado) {
  try {
    await deleteMovimiento(idCreado);
    if (movimientoResaltado.value === idCreado) movimientoResaltado.value = null;
    mostrar({tono: "info", icono: "refresh", titulo: "Movimiento deshecho"});
  } catch {
    mostrar({tono: "expense", icono: "alert-circle", titulo: "No se pudo deshacer", detalle: "Elimínalo desde la lista de movimientos."});
  }
}

/** La lista resalta la fila nueva y el total que cambió durante unos segundos */
function resaltar(idCreado) {
  movimientoResaltado.value = idCreado ?? null;
  ultimoGuardado.value = {tipo: form.tipo, monto: monto.value, divisaId: form.divisaId};
  setTimeout(() => {
    if (movimientoResaltado.value === idCreado) movimientoResaltado.value = null;
    ultimoGuardado.value = null;
  }, 6000);
}

async function guardar({crearOtro = false} = {}) {
  intentado.value = true;
  if (Object.keys(errores.value).length) return;

  try {
    if (editando.value) {
      await updateMovimiento(props.id, armarPayload());
      mostrar({titulo: "Cambios guardados", detalle: form.titulo.trim() || resumenGuardado()});
      resaltar(props.id);
    } else {
      const resumen = resumenGuardado();
      const titulo = {EGRESO: "Gasto guardado", INGRESO: "Ingreso guardado", TRANSFERENCIA: "Transferencia registrada"}[form.tipo];
      // La API responde con el resultado de insertOne: el id del movimiento creado
      const idCreado = (await createMovimiento(armarPayload()))?.data?.insertedId;
      mostrar({titulo, detalle: resumen, accion: idCreado ? {texto: "Deshacer", ejecutar: () => deshacer(idCreado)} : undefined});
      resaltar(idCreado);
    }
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
    mostrar({tono: "expense", icono: "alert-circle", titulo: editando.value ? "No se pudieron guardar los cambios" : "No se pudo guardar", detalle: err.response?.data?.message || "Inténtalo de nuevo."});
  }
}

function alTeclear(e) {
  if (e.key === "Escape") emit("cerrar");
  else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    guardar({crearOtro: !editando.value});
  }
}
</script>

<template>
  <div class="mm-root" data-theme="light">
    <div class="mm-overlay" @click.self="emit('cerrar')" @keydown="alTeclear">
      <form ref="modal" class="mm-modal" :style="esTransferencia ? {width: 'min(560px, 100%)'} : null" role="dialog" aria-modal="true" aria-labelledby="mov-titulo" novalidate @submit.prevent="guardar()">
        <div class="mm-modal-h">
          <div v-if="editando && original" class="mm-ico cat" :style="{background: colorMovimiento(original)}"><MmIcon :i="iconoMovimiento(original)" :s="22" /></div>
          <div class="grow">
            <h2 id="mov-titulo" class="t-h2">{{ editando ? "Editar movimiento" : "Nuevo movimiento" }}</h2>
            <p class="t-sm muted">{{ editando ? (original ? `Creado · ${fechaCorta(original.createdAt ?? original.fecha)}` : "") : esTransferencia ? "Mueve plata entre tus cuentas" : "Registra en segundos" }}</p>
          </div>
          <button type="button" class="mm-x" aria-label="Cerrar" @click="emit('cerrar')"><MmIcon i="close" :s="20" /></button>
        </div>

        <!-- Cargando el movimiento a editar -->
        <div v-if="cargandoMov" class="mm-modal-b" style="min-height: 320px" role="status" aria-label="Cargando el movimiento">
          <div class="mm-skel" style="width: 100%; height: 48px"></div>
          <div class="mm-skel" style="width: 100%; height: 72px"></div>
          <div class="mm-skel" style="width: 100%; height: 48px"></div>
          <div class="mm-skel" style="width: 100%; height: 48px"></div>
        </div>
        <div v-else-if="errorCarga" class="mm-modal-b">
          <div class="mm-banner expense" role="alert"><MmIcon i="alert-circle" :s="18" /><span class="grow">{{ errorCarga }}</span></div>
        </div>

        <div v-else class="mm-modal-b">
          <div v-if="hayCambios" class="mm-banner warn" role="status">
            <MmIcon i="create" :s="18" /><span class="grow">Tienes cambios sin guardar</span>
            <button type="button" class="t-sm" style="border: 0; background: none; color: inherit; font-weight: 700; text-decoration: underline" @click="descartarCambios">Descartar</button>
          </div>

          <div class="mm-seg typed lg" role="group" aria-label="Tipo de movimiento" :data-v="indiceTipo" :style="{'--n': TIPOS.length, '--on': indiceTipo, width: '100%'}">
            <i class="thumb"></i>
            <button v-for="t in TIPOS" :key="t.id" type="button" :class="{'is-on': form.tipo === t.id}" :aria-pressed="form.tipo === t.id" :disabled="editando && (t.id === 'TRANSFERENCIA') !== esTransferencia" :title="editando && (t.id === 'TRANSFERENCIA') !== esTransferencia ? 'Una transferencia no puede cambiar de tipo' : null" @click="cambiarTipo(t.id)"><MmIcon :i="t.icono" :s="14" />{{ t.etiqueta }}</button>
          </div>

          <div class="mm-field">
            <label for="mov-monto">Monto</label>
            <div class="mm-input amount" :class="[tipoActual.tono, {'is-error': verError('monto')}]">
              <span class="muted" style="font-size: 22px">$</span>
              <input id="mov-monto" ref="campoMonto" :value="form.montoTexto" inputmode="decimal" placeholder="0" autocomplete="off" style="font-size: 32px; color: inherit" :aria-invalid="Boolean(verError('monto'))" @input="alEscribirMonto" />
              <span v-if="montoAnterior" class="mm-badge warn">antes {{ montoAnterior }}</span>
              <select v-model="form.divisaId" class="divisa" aria-label="Divisa">
                <option v-for="d in divisas" :key="d.value" :value="d.value">{{ d.value }}</option>
              </select>
            </div>
            <span v-if="verError('monto')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("monto") }}</span>
          </div>

          <template v-if="!esTransferencia">
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
          </template>

          <!-- Transferencia: de qué cuenta sale, a cuál llega y cómo queda cada saldo -->
          <template v-else>
            <div class="transferencia">
              <div class="mm-card flat" style="padding: 14px">
                <label class="t-over" for="mov-origen">Desde</label>
                <div class="row gap-2" style="margin-top: 8px">
                  <div class="mm-ico cat sm" :style="{background: origen.color}"><MmIcon :i="origen.icono" :s="18" /></div>
                  <div class="grow" style="min-width: 0">
                    <div class="mm-input mm-select campo-cuenta"><select id="mov-origen" v-model="form.origenId" :aria-invalid="Boolean(verError('origenId'))"><option v-for="c in cuentas" :key="c.id" :value="c.id">{{ c.nombre }}</option></select></div>
                    <div class="t-xs muted">{{ origen.detalle }}</div>
                  </div>
                </div>
                <template v-if="origen.saldo !== null">
                  <div class="divider" style="margin: 12px 0"></div>
                  <div class="t-xs muted">Queda en</div>
                  <div class="row gap-2" style="align-items: baseline; flex-wrap: wrap">
                    <span v-if="monto > 0" class="t-sm muted num" style="text-decoration: line-through">{{ dinero(origen.saldo) }}</span>
                    <b class="num" :class="{expense: origen.saldo - monto < 0}">{{ dinero(origen.saldo - monto) }}</b>
                  </div>
                </template>
              </div>

              <button type="button" class="mm-btn icon" aria-label="Intercambiar cuentas" style="border-radius: 50%; background: var(--info-tint); color: var(--info); border: 0" @click="intercambiarCuentas"><MmIcon i="swap-horizontal" :s="18" /></button>

              <div class="mm-card flat" style="padding: 14px; border-color: var(--info)">
                <label class="t-over" for="mov-destino">Hacia</label>
                <div class="row gap-2" style="margin-top: 8px">
                  <div class="mm-ico cat sm" :style="{background: destino.color}"><MmIcon :i="destino.icono" :s="18" /></div>
                  <div class="grow" style="min-width: 0">
                    <div class="mm-input mm-select campo-cuenta"><select id="mov-destino" v-model="form.destinoId" :aria-invalid="Boolean(verError('destinoId'))"><option v-for="c in cuentas" :key="c.id" :value="c.id">{{ c.nombre }}</option></select></div>
                    <div class="t-xs muted">{{ destino.detalle }}</div>
                  </div>
                </div>
                <template v-if="destino.saldo !== null">
                  <div class="divider" style="margin: 12px 0"></div>
                  <div class="t-xs muted">Queda en</div>
                  <div class="row gap-2" style="align-items: baseline; flex-wrap: wrap">
                    <span v-if="monto > 0" class="t-sm muted num" style="text-decoration: line-through">{{ dinero(destino.saldo) }}</span>
                    <b class="num info">{{ dinero(destino.saldo + monto) }}</b>
                  </div>
                </template>
              </div>
            </div>
            <span v-if="verError('origenId')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("origenId") }}</span>
            <span v-if="verError('destinoId')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("destinoId") }}</span>

            <div class="mm-banner info"><MmIcon i="information-circle" :s="18" /><span>Tu balance total no cambia: sigues con <b class="num">{{ dinero(saldoTotal) }}</b>.</span></div>
            <div v-if="origen.saldo !== null && monto > 0 && origen.saldo - monto < 0" class="mm-banner warn"><MmIcon i="warning" :s="18" /><span>{{ origen.nombre }} quedaría con saldo negativo.</span></div>

            <div class="mm-field">
              <label for="mov-fecha-t">Fecha</label>
              <div class="mm-input" :class="{'is-error': verError('fecha')}"><MmIcon i="calendar" :s="18" /><input id="mov-fecha-t" v-model="form.fecha" type="date" /></div>
              <span v-if="verError('fecha')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("fecha") }}</span>
            </div>
          </template>

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
          <button v-if="editando" type="button" class="mm-btn danger-soft" @click="emit('eliminar')"><MmIcon i="trash" :s="18" />Eliminar</button>
          <span v-if="!editando" class="t-xs muted grow row gap-1 mm-only-desktop" style="white-space: nowrap"><span class="mm-kbd">Ctrl</span>+<span class="mm-kbd">Enter</span>guarda y crea otro</span>
          <span v-else class="grow"></span>
          <button type="button" class="mm-btn ghost" @click="emit('cerrar')">Cancelar</button>
          <button type="submit" class="mm-btn primary" :class="{'is-loading': guardando}" :disabled="guardando || cargandoMov || Boolean(errorCarga) || (editando && !hayCambios)">
            <MmIcon i="checkmark" :s="18" />{{ editando ? "Guardar cambios" : tipoActual.guardar }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.transferencia {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 44px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
}
/* Selector de cuenta sin caja propia: vive dentro de la tarjeta Desde / Hacia */
.campo-cuenta {
  height: 32px;
  padding: 0;
  background: none;
  border: 0;
  box-shadow: none;
  font-weight: 700;
  font-size: 14px;
}
.campo-cuenta:hover {
  background: none;
}
@media (max-width: 720px) {
  .transferencia {
    grid-template-columns: minmax(0, 1fr);
  }
}
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
