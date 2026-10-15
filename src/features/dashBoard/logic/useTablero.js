import {ref, computed} from "vue";
import axios from "axios";

import {capitalizar, nombreMes, nombreMesCorto, parseLabelEntidad} from "./formato.js";
import {rangoDe, baseAnterior} from "../../movimientos/logic/periodos.js";
import {movimientos, entidades, pedirMovimientos, cargarTodosLosMovimientos, cargarEntidades} from "../../movimientos/logic/movimientosStore.js";

/**
 * Datos de "Mi estado actual". Todo sale de los endpoints existentes de la API:
 *   POST movimiento/dashboard  -> totales de ingresos y gastos (con o sin rango de fechas)
 *   POST movimiento/ranking    -> gasto por categoría
 *   POST movimiento/list       -> movimientos paginados (últimos, saldos y búsqueda)
 *   GET  entidad               -> cuentas del usuario (solo id y etiqueta)
 *
 * La API no entrega saldos por cuenta ni comparativos, así que se calculan aquí.
 * Es un singleton: el selector de periodo vive en la barra superior y la página lo lee.
 */
const API_URL = import.meta.env.VITE_API_URL;
const OPCIONES = {withCredentials: true};

const MESES_FLUJO = 6;

// ---------- Estado ----------
export const periodo = ref("mes"); // "semana" | "mes" | "anio"
const cargando = ref(false); // solo la primera carga muestra el esqueleto
const primeraCarga = ref(true);
const error = ref("");

const totalesTodo = ref({ingresos: 0, gastos: 0, disponible: 0});
const totalesPrevioFin = ref({ingresos: 0, gastos: 0, disponible: 0}); // acumulado hasta el fin del periodo anterior
const totalesActual = ref({ingresos: 0, gastos: 0});
const totalesPrevio = ref({ingresos: 0, gastos: 0});
const flujo = ref([]); // [{etiqueta, ingresos, gastos}] de los últimos 6 meses
const ranking = ref([]);

export const tabRecientes = ref("TODOS"); // "TODOS" | "INGRESO" | "EGRESO" | "TRANSFERENCIA"
const recientes = ref([]);
const cargandoRecientes = ref(false);

// Cache de totales por rango para no repetir llamadas (el flujo reutiliza los meses del periodo)
const cacheTotales = new Map();

// ---------- Fechas ----------
/** Textos que dependen del periodo: migas, "vs. …" y nombre del periodo anterior */
export function etiquetasPeriodo(p = periodo.value, base = new Date()) {
  const prev = baseAnterior(p, base);
  if (p === "semana") return {actual: "Esta semana", previo: "la semana pasada", migas: "Resumen · Esta semana", acumulado: "Acumulado de la semana"};
  if (p === "anio") return {actual: String(base.getFullYear()), previo: String(prev.getFullYear()), migas: `Resumen · ${base.getFullYear()}`, acumulado: "Acumulado del año"};
  return {
    actual: capitalizar(nombreMes(base)),
    previo: nombreMes(prev),
    migas: `Resumen · ${capitalizar(nombreMes(base))} ${base.getFullYear()}`,
    acumulado: "Acumulado del mes",
  };
}

// ---------- Llamadas ----------
async function totales(inicio, fin) {
  const clave = `${inicio?.toISOString() ?? ""}|${fin?.toISOString() ?? ""}`;
  if (!cacheTotales.has(clave)) {
    const body = {};
    if (inicio) body.fechaInicio = inicio.toISOString();
    if (fin) body.fechaFin = fin.toISOString();

    cacheTotales.set(
      clave,
      axios.post(`${API_URL}movimiento/dashboard`, body, OPCIONES).then((res) => {
        const d = res.data?.data ?? {};
        return {ingresos: d.totalIngresado ?? 0, gastos: d.totalEgresado ?? 0, disponible: d.totalDisponible ?? 0};
      })
    );
  }
  return cacheTotales.get(clave);
}

async function cargarRanking(rango) {
  const res = await axios.post(`${API_URL}movimiento/ranking`, {fechaInicio: rango.inicio.toISOString(), fechaFin: rango.fin.toISOString()}, OPCIONES);
  return res.data?.data ?? [];
}

export async function cargarRecientes() {
  cargandoRecientes.value = true;
  try {
    const body = {page: 1, limit: 5};
    if (tabRecientes.value !== "TODOS") body.tipo = tabRecientes.value;
    recientes.value = (await pedirMovimientos(body)).data;
  } catch {
    recientes.value = [];
  } finally {
    cargandoRecientes.value = false;
  }
}

/**
 * Carga (o recarga) todo el tablero.
 * @param {{refrescar?: boolean}} opciones `refrescar` descarta la caché (tras crear/editar datos)
 */
export async function cargarTablero({refrescar = false} = {}) {
  if (refrescar) cacheTotales.clear();
  if (primeraCarga.value) cargando.value = true;
  error.value = "";

  try {
    const base = new Date();
    const p = periodo.value;
    const actual = rangoDe(p, base);
    const previo = rangoDe(p, baseAnterior(p, base));

    const meses = Array.from({length: MESES_FLUJO}, (_, i) => {
      const mBase = new Date(base.getFullYear(), base.getMonth() - (MESES_FLUJO - 1 - i), 1);
      return {base: mBase, ...rangoDe("mes", mBase)};
    });

    const [todo, hastaPrevio, tActual, tPrevio, serieFlujo, rank] = await Promise.all([
      totales(),
      totales(undefined, previo.fin),
      totales(actual.inicio, actual.fin),
      totales(previo.inicio, previo.fin),
      Promise.all(meses.map((m) => totales(m.inicio, m.fin))),
      cargarRanking(actual),
      // Estos tres no dependen del periodo; solo se piden en la primera carga o al refrescar
      refrescar || primeraCarga.value ? Promise.all([cargarTodosLosMovimientos(), cargarEntidades()]) : null,
      cargarRecientes(),
    ]);

    totalesTodo.value = todo;
    totalesPrevioFin.value = hastaPrevio;
    totalesActual.value = tActual;
    totalesPrevio.value = tPrevio;
    flujo.value = serieFlujo.map((t, i) => ({etiqueta: nombreMesCorto(meses[i].base), ingresos: t.ingresos, gastos: t.gastos}));
    ranking.value = rank;
    primeraCarga.value = false;
  } catch (err) {
    error.value = err.response?.data?.message || "No pudimos cargar tu información. Revisa tu conexión e inténtalo de nuevo.";
  } finally {
    cargando.value = false;
  }
}

// ---------- Derivados ----------
/** Variación porcentual; null si no hay base de comparación */
export function variacion(actual, previo) {
  if (!previo) return null;
  return ((actual - previo) / Math.abs(previo)) * 100;
}

/** La divisa más usada en los movimientos (la API suma montos sin convertir monedas) */
const divisaPrincipal = computed(() => {
  const conteo = {};
  for (const m of movimientos.value) if (m.divisaId) conteo[m.divisaId] = (conteo[m.divisaId] || 0) + 1;
  return Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "COP";
});

/** Cuentas con su saldo, calculado a partir de los movimientos */
const cuentas = computed(() => {
  const saldos = new Map();
  const info = new Map();
  const sumar = (id, valor, divisaId) => {
    if (!id) return;
    const actual = saldos.get(id) ?? {saldo: 0, divisaId};
    actual.saldo += valor;
    actual.divisaId = actual.divisaId || divisaId;
    saldos.set(id, actual);
  };

  for (const m of movimientos.value) {
    if (m.tipo === "INGRESO") sumar(m.entidadId, m.monto, m.divisaId);
    else if (m.tipo === "EGRESO") sumar(m.entidadId, -m.monto, m.divisaId);
    else if (m.tipo === "TRANSFERENCIA") {
      sumar(m.transferencia?.origenEntidadId, -m.monto, m.divisaId);
      sumar(m.transferencia?.destinoEntidadId, m.monto, m.divisaId);
    }
    // El detalle trae tipo y número de la cuenta; la lista de entidades solo trae una etiqueta
    if (m.entidad?._id) info.set(m.entidad._id, m.entidad);
  }

  return entidades.value.map((e) => {
    const id = e._id ?? e.value;
    const datos = info.get(id) ?? parseLabelEntidad(e.label);
    const s = saldos.get(id);
    return {id, nombre: datos.nombre, tipo: datos.tipo, numero: datos.numero, saldo: s?.saldo ?? 0, divisaId: s?.divisaId ?? divisaPrincipal.value};
  });
});

const kpis = computed(() => {
  const ingresos = totalesActual.value.ingresos;
  const gastos = totalesActual.value.gastos;
  return {
    disponible: {valor: totalesTodo.value.disponible, variacion: variacion(totalesTodo.value.disponible, totalesPrevioFin.value.disponible)},
    ingresos: {valor: ingresos, variacion: variacion(ingresos, totalesPrevio.value.ingresos)},
    gastos: {valor: gastos, variacion: variacion(gastos, totalesPrevio.value.gastos)},
    // Qué parte de lo que entró no se gastó; si no hubo ingresos no hay tasa que mostrar
    ahorro: ingresos > 0 ? Math.max(0, Math.min(100, Math.round(((ingresos - gastos) / ingresos) * 100))) : null,
  };
});

/**
 * Sin actividad propia: no hay movimientos, o solo el ingreso de "saldo inicial" que crea la API al
 * abrir una cuenta (esSistema). El tablero muestra entonces los primeros pasos en vez de ceros.
 */
const sinMovimientos = computed(() => !primeraCarga.value && !error.value && movimientos.value.every((m) => m.esSistema));

export function useTablero() {
  return {
    periodo,
    tabRecientes,
    cargando,
    error,
    kpis,
    flujo,
    ranking,
    movimientos,
    recientes,
    cargandoRecientes,
    cuentas,
    divisaPrincipal,
    sinMovimientos,
    totalGastoPeriodo: computed(() => totalesActual.value.gastos),
    etiquetas: computed(() => etiquetasPeriodo(periodo.value)),
    cargar: cargarTablero,
    cargarRecientes,
  };
}
