/**
 * Gastos fijos y suscripciones. La API no tiene un recurso propio para esto: un gasto fijo es un
 * movimiento EGRESO marcado como recurrente (esRecurrente), y aquí se agrupan sus repeticiones por
 * nombre y cuenta. Se asume cobro mensual el mismo día; el monto es el del último cobro.
 */
import {esFlujo, delMes, totales} from "@/features/reportes/logic/calculos.js";

// Un fijo que no se cobró en los últimos meses se considera cancelado y deja de aparecer
const MESES_ACTIVO = 3;

const sinTildes = (t) => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const esSuscripcion = (m) => /suscrip/.test(sinTildes(m.categoria?.categoria ?? ""));

/** Los fijos activos: [{clave, id, nombre, monto, dia, categoria, cuenta, suscripcion, pagado, ultima}] ordenados por día */
export function detectarFijos(movs, hoy = new Date()) {
  const grupos = new Map();
  for (const m of movs) {
    if (!esFlujo(m) || m.tipo !== "EGRESO" || !m.esRecurrente) continue;
    const nombre = m.concepto?.titulo || m.subcategoria?.subcategoria || m.categoria?.categoria || "Gasto fijo";
    const clave = `${sinTildes(nombre)}|${m.entidadId ?? ""}`;
    const g = grupos.get(clave) ?? {clave, nombre, cobros: []};
    g.cobros.push(m);
    grupos.set(clave, g);
  }

  const limite = new Date(hoy.getFullYear(), hoy.getMonth() - (MESES_ACTIVO - 1), 1);
  const lista = [];
  for (const g of grupos.values()) {
    const ultimo = [...g.cobros].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
    const fecha = new Date(ultimo.fecha);
    if (fecha < limite) continue;
    lista.push({
      clave: g.clave,
      id: ultimo._id,
      nombre: g.nombre,
      monto: ultimo.monto,
      dia: fecha.getDate(),
      categoria: ultimo.categoria,
      cuenta: ultimo.entidad?.nombre ?? "",
      suscripcion: esSuscripcion(ultimo),
      pagado: g.cobros.some((c) => {
        const f = new Date(c.fecha);
        return f.getFullYear() === hoy.getFullYear() && f.getMonth() === hoy.getMonth();
      }),
    });
  }
  return lista.sort((a, b) => a.dia - b.dia || a.nombre.localeCompare(b.nombre));
}

/** Cuánto falta para el cobro: {texto, tono} para la insignia de cada fila */
export function estadoDeCobro(f, hoy = new Date(), nombreMesCorto = "") {
  if (f.pagado) return {texto: "Pagado", tono: "income"};
  const faltan = f.dia - hoy.getDate();
  if (faltan < 0) return {texto: "Pendiente", tono: "expense"};
  if (faltan === 0) return {texto: "Hoy", tono: "warn"};
  if (faltan <= 4) return {texto: faltan === 1 ? "Mañana" : `En ${faltan} días`, tono: "warn"};
  return {texto: `${f.dia} ${nombreMesCorto}`, tono: ""};
}

/** Totales del mes en curso para las tarjetas de arriba */
export function resumenDeFijos(fijos, movs, hoy = new Date()) {
  const total = fijos.reduce((s, f) => s + f.monto, 0);
  const pagados = fijos.filter((f) => f.pagado);

  // Peso sobre los ingresos: promedio de los últimos 3 meses con ingresos (el mes en curso puede estar vacío)
  const ingresos = [0, 1, 2]
    .map((i) => totales(delMes(movs, hoy.getFullYear(), hoy.getMonth() - i)).ingresos)
    .filter((v) => v > 0);
  const ingresoMensual = ingresos.length ? ingresos.reduce((a, b) => a + b, 0) / ingresos.length : 0;

  const proximo = fijos.filter((f) => !f.pagado && f.dia >= hoy.getDate()).sort((a, b) => a.dia - b.dia)[0] ?? null;

  return {
    total,
    cantidad: fijos.length,
    pagado: pagados.reduce((s, f) => s + f.monto, 0),
    cantidadPagados: pagados.length,
    pctIngresos: ingresoMensual > 0 ? Math.round((total / ingresoMensual) * 100) : null,
    proximo,
  };
}

/** Los fijos agrupados por categoría, de mayor a menor: [{nombre, color, monto, pct}] */
export function repartoDeFijos(fijos) {
  const mapa = new Map();
  for (const f of fijos) {
    const nombre = f.categoria?.categoria ?? "Sin categoría";
    const fila = mapa.get(nombre) ?? {nombre, color: f.categoria?.color ?? "var(--ink-subtle)", monto: 0};
    fila.monto += f.monto;
    mapa.set(nombre, fila);
  }
  const total = fijos.reduce((s, f) => s + f.monto, 0) || 1;
  return [...mapa.values()].sort((a, b) => b.monto - a.monto).map((f) => ({...f, pct: (f.monto / total) * 100}));
}
