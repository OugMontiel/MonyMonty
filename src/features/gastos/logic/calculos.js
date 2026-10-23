/**
 * Cálculos de Mis gastos. Parten de los movimientos de la API (POST movimiento/list) y reutilizan
 * las reglas de los reportes: solo cuentan los gastos reales (EGRESO), no las transferencias entre
 * cuentas ni el saldo inicial.
 */
import {esFlujo, delMes, enRango, inicioDeMes, gastoPorCategoria} from "@/features/reportes/logic/calculos.js";
import {nombreMesCorto} from "@/features/dashBoard/logic/formato.js";

const DIAS_PLURAL = ["domingos", "lunes", "martes", "miércoles", "jueves", "viernes", "sábados"];
const DIAS_SINGULAR = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/** Gastos reales de una lista de movimientos */
export const soloGastos = (movs) => movs.filter((m) => esFlujo(m) && m.tipo === "EGRESO");

const suma = (movs) => movs.reduce((s, m) => s + m.monto, 0);

/**
 * Cuántos días del mes ya pasaron: todo el mes si es pasado, hasta hoy si es el actual.
 * Sirve para promediar por día y para comparar contra el mismo tramo del mes anterior.
 */
export function diasTranscurridos(anio, mes, hoy) {
  const enCurso = anio === hoy.getFullYear() && mes === hoy.getMonth();
  return enCurso ? hoy.getDate() : new Date(anio, mes + 1, 0).getDate();
}

/** Gasto de un mes hasta cierto día (inclusive) */
function gastoHastaElDia(movs, anio, mes, dia) {
  const fin = new Date(anio, mes, dia, 23, 59, 59, 999);
  return soloGastos(enRango(movs, inicioDeMes(anio, mes), fin));
}

/** Los últimos `n` meses que terminan en (anio, mes): [{anio, mes, etiqueta, monto}] */
export function ultimosMeses(movs, anio, mes, n = 6) {
  return Array.from({length: n}, (_, i) => {
    const f = new Date(anio, mes - (n - 1 - i), 1);
    return {anio: f.getFullYear(), mes: f.getMonth(), etiqueta: nombreMesCorto(f), monto: suma(soloGastos(delMes(movs, f.getFullYear(), f.getMonth())))};
  });
}

/**
 * Resumen del mes: total, cambio frente al mes anterior (al mismo día si el mes sigue en curso),
 * promedio mensual, gasto diario, mayor gasto, ranking por categoría y lecturas automáticas.
 */
export function resumenDeGastos(movs, anio, mes, hoy = new Date()) {
  const delPeriodo = soloGastos(delMes(movs, anio, mes));
  const total = suma(delPeriodo);
  const dias = diasTranscurridos(anio, mes, hoy);

  const anterior = new Date(anio, mes - 1, 1);
  const diaTope = Math.min(dias, new Date(anterior.getFullYear(), anterior.getMonth() + 1, 0).getDate());
  const delAnterior = gastoHastaElDia(movs, anterior.getFullYear(), anterior.getMonth(), diaTope);
  const totalAnterior = suma(delAnterior);
  const cambioPct = totalAnterior > 0 ? ((total - totalAnterior) / totalAnterior) * 100 : null;

  const serie = ultimosMeses(movs, anio, mes);
  const conGasto = serie.filter((m) => m.monto > 0);
  const promedioMensual = conGasto.length ? suma(conGasto.map((m) => ({monto: m.monto}))) / conGasto.length : 0;

  const mayor = [...delPeriodo].sort((a, b) => b.monto - a.monto)[0] ?? null;
  const categorias = gastoPorCategoria(delPeriodo);

  return {
    movimientos: delPeriodo,
    total,
    totalAnterior,
    mesAnterior: anterior,
    cambioPct,
    dias,
    gastoDiario: dias ? total / dias : 0,
    promedioMensual,
    serie,
    mayor,
    categorias,
    lecturas: lecturas(delPeriodo, delAnterior, categorias),
  };
}

/** Hasta tres hallazgos: dónde subió, dónde bajó y qué día de la semana se gasta más */
function lecturas(delPeriodo, delAnterior, categorias) {
  const lista = [];
  const antes = new Map(gastoPorCategoria(delAnterior).map((c) => [c.id, c.monto]));
  const cambios = categorias.map((c) => ({...c, delta: c.monto - (antes.get(c.id) ?? 0), previo: antes.get(c.id) ?? 0}));

  const sube = [...cambios].filter((c) => c.previo > 0 && c.delta > 0).sort((a, b) => b.delta - a.delta)[0];
  if (sube) lista.push({tono: "warn", icono: "trending-up", titulo: `Gastaste más en ${sube.nombre}`, texto: `${formatoDelta(sube.delta)} más que en el mismo tramo del mes anterior.`, delta: sube.delta});

  const baja = [...cambios].filter((c) => c.previo > 0 && c.delta < 0).sort((a, b) => a.delta - b.delta)[0];
  if (baja) lista.push({tono: "income", icono: "trending-down", titulo: `Gastaste menos en ${baja.nombre}`, texto: `${formatoDelta(-baja.delta)} menos que en el mismo tramo del mes anterior.`, delta: baja.delta});

  if (delPeriodo.length >= 6) {
    const porDia = new Array(7).fill(0);
    for (const m of delPeriodo) porDia[new Date(m.fecha).getDay()] += m.monto;
    const total = porDia.reduce((a, b) => a + b, 0);
    const mejor = porDia.indexOf(Math.max(...porDia));
    const pct = total ? Math.round((porDia[mejor] / total) * 100) : 0;
    // Con 7 días iguales tocaría el 14 %: solo se avisa si el día destaca
    if (pct >= 25) lista.push({tono: "balance", icono: "calendar", titulo: `Los ${DIAS_PLURAL[mejor]} gastas más`, texto: `El ${pct} % de tus gastos del mes fue en ${DIAS_SINGULAR[mejor]}.`});
  }
  return lista;
}

function formatoDelta(v) {
  return `$ ${Math.round(v).toLocaleString("es-CO")}`;
}
