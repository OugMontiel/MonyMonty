/**
 * Cálculos de los reportes. Todo parte de los movimientos que entrega POST movimiento/list
 * (tipo INGRESO / EGRESO / TRANSFERENCIA, monto, fecha, categoria, entidadId…), porque la API
 * todavía no tiene endpoints de reportes.
 *
 * Reglas:
 *  - Las transferencias entre cuentas propias no son ingreso ni gasto.
 *  - El "saldo inicial" que crea la API al abrir una cuenta (esSistema) tampoco es un ingreso del
 *    periodo, pero sí cuenta para el patrimonio.
 *  - Los montos se suman tal cual: si hay varias divisas no se convierten.
 */
import {nombreMesCorto, capitalizar, nombreMes} from "@/features/dashBoard/logic/formato.js";

/** ¿Cuenta como flujo de dinero (ingreso o gasto real)? */
export const esFlujo = (m) => !m.esSistema && m.tipo !== "TRANSFERENCIA";

export const inicioDeMes = (anio, mes) => new Date(anio, mes, 1);
export const finDeMes = (anio, mes) => new Date(anio, mes + 1, 0, 23, 59, 59, 999);

export function enRango(movs, inicio, fin) {
  return movs.filter((m) => {
    const f = new Date(m.fecha);
    return f >= inicio && f <= fin;
  });
}

export const delMes = (movs, anio, mes) => enRango(movs, inicioDeMes(anio, mes), finDeMes(anio, mes));
export const delAnio = (movs, anio) => enRango(movs, new Date(anio, 0, 1), new Date(anio, 11, 31, 23, 59, 59, 999));

/** Ingresos, gastos, ahorro y tasa de ahorro de una lista de movimientos (solo flujo real) */
export function totales(movs) {
  let ingresos = 0;
  let gastos = 0;
  let cantidadIngresos = 0;
  let cantidadGastos = 0;
  for (const m of movs) {
    if (!esFlujo(m)) continue;
    if (m.tipo === "INGRESO") {
      ingresos += m.monto;
      cantidadIngresos++;
    } else if (m.tipo === "EGRESO") {
      gastos += m.monto;
      cantidadGastos++;
    }
  }
  const ahorro = ingresos - gastos;
  // Sin ingresos no hay tasa que calcular
  const tasa = ingresos > 0 ? Math.round((ahorro / ingresos) * 100) : null;
  return {ingresos, gastos, ahorro, tasa, cantidadIngresos, cantidadGastos};
}

/** Un registro por mes del año: [{mes, etiqueta, nombre, ingresos, gastos, ahorro, tasa, cantidad}] */
export function mesesDelAnio(movs, anio, hastaMes = 11) {
  return Array.from({length: hastaMes + 1}, (_, mes) => {
    const delMesActual = delMes(movs, anio, mes);
    const t = totales(delMesActual);
    return {mes, anio, etiqueta: nombreMesCorto(new Date(anio, mes, 1)), nombre: capitalizar(nombreMes(new Date(anio, mes, 1))), ...t, cantidad: delMesActual.filter(esFlujo).length};
  });
}

/** Gasto por categoría: [{id, nombre, color, icono, monto, pct, cantidad}] de mayor a menor */
export function gastoPorCategoria(movs) {
  const mapa = new Map();
  let total = 0;
  for (const m of movs) {
    if (!esFlujo(m) || m.tipo !== "EGRESO") continue;
    const id = m.categoriaId ?? "sin-categoria";
    const fila = mapa.get(id) ?? {id, nombre: m.categoria?.categoria ?? "Sin categoría", color: m.categoria?.color ?? "var(--ink-subtle)", icono: m.categoria?.icono, monto: 0, cantidad: 0};
    fila.monto += m.monto;
    fila.cantidad++;
    mapa.set(id, fila);
    total += m.monto;
  }
  return [...mapa.values()].sort((a, b) => b.monto - a.monto).map((f) => ({...f, pct: total ? (f.monto / total) * 100 : 0}));
}

/** Entró, salió y neto por cuenta, más las transferencias que la tocaron */
export function porCuenta(movs, cuentas) {
  const filas = new Map(cuentas.map((c) => [c.id, {cuenta: c, entro: 0, salio: 0, transferido: 0}]));
  for (const m of movs) {
    if (m.esSistema) continue;
    if (m.tipo === "TRANSFERENCIA") {
      for (const id of [m.transferencia?.origenEntidadId, m.transferencia?.destinoEntidadId]) {
        if (filas.has(id)) filas.get(id).transferido += m.monto;
      }
      continue;
    }
    const f = filas.get(m.entidadId);
    if (!f) continue;
    if (m.tipo === "INGRESO") f.entro += m.monto;
    else f.salio += m.monto;
  }
  return [...filas.values()].map((f) => ({...f, neto: f.entro - f.salio}));
}

/**
 * Patrimonio líquido (suma de saldos de las cuentas) al cierre de cada mes del año.
 * Incluye el saldo inicial y las transferencias (que no cambian el total).
 */
export function patrimonioPorMes(movs, anio, hastaMes = 11) {
  const ordenados = [...movs].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  return Array.from({length: hastaMes + 1}, (_, mes) => {
    const corte = finDeMes(anio, mes);
    let valor = 0;
    for (const m of ordenados) {
      if (new Date(m.fecha) > corte) break;
      if (m.tipo === "INGRESO") valor += m.monto;
      else if (m.tipo === "EGRESO") valor -= m.monto;
    }
    return {mes, etiqueta: nombreMesCorto(new Date(anio, mes, 1)), valor};
  });
}

/** Techo "redondo" (1, 2, 5 o 10 × potencia de diez) y marcas con valores limpios para el eje Y de un gráfico */
export function escalaEje(maximo) {
  const m = Math.max(1, maximo);
  const mag = 10 ** Math.floor(Math.log10(m));
  const norm = m / mag;
  const base = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  // 4 intervalos para 1 y 2 (0,25 / 0,5), 5 para 5 y 10 (1 / 2): ningún valor "raro" como 3,33
  const intervalos = base <= 2 ? 4 : 5;
  const techo = base * mag;
  return {techo, marcas: Array.from({length: intervalos + 1}, (_, i) => (techo * i) / intervalos)};
}

/** Variación porcentual entera; null si no hay base */
export function cambioPct(actual, previo) {
  if (!previo) return null;
  return Math.round(((actual - previo) / Math.abs(previo)) * 100);
}

/** Saldo de cada cuenta al cierre de `fecha` (las transferencias restan del origen y suman al destino) */
export function saldosPorCuenta(movs, cuentas, fecha) {
  const saldos = new Map(cuentas.map((c) => [c.id, {cuenta: c, saldo: 0}]));
  for (const m of movs) {
    if (new Date(m.fecha) > fecha) continue;
    if (m.tipo === "TRANSFERENCIA") {
      const o = saldos.get(m.transferencia?.origenEntidadId);
      const d = saldos.get(m.transferencia?.destinoEntidadId);
      if (o) o.saldo -= m.monto;
      if (d) d.saldo += m.monto;
      continue;
    }
    const f = saldos.get(m.entidadId);
    if (!f) continue;
    f.saldo += m.tipo === "INGRESO" ? m.monto : -m.monto;
  }
  return [...saldos.values()];
}

/** Suma de saldos de todas las cuentas hasta una fecha (ingresos − gastos; las transferencias no cambian el total) */
export function patrimonioAl(movs, fecha) {
  let valor = 0;
  for (const m of movs) {
    if (new Date(m.fecha) > fecha) continue;
    if (m.tipo === "INGRESO") valor += m.monto;
    else if (m.tipo === "EGRESO") valor -= m.monto;
  }
  return valor;
}

/** Gasto promedio de los últimos `n` meses con gastos que terminan en (anio, mes) */
export function gastoPromedioMensual(movs, anio, mes, n = 3) {
  const montos = [];
  for (let i = 0; i < 12 && montos.length < n; i++) {
    const f = new Date(anio, mes - i, 1);
    const g = totales(delMes(movs, f.getFullYear(), f.getMonth())).gastos;
    if (g > 0) montos.push(g);
  }
  return montos.length ? montos.reduce((a, b) => a + b, 0) / montos.length : 0;
}

/** Qué parte de los ingresos del mes llegó entre los días `desde` y `hasta` (0–100), o null si no hubo ingresos */
export function ingresosEntreDias(movs, desde, hasta) {
  const ingresos = movs.filter((m) => esFlujo(m) && m.tipo === "INGRESO");
  const total = ingresos.reduce((s, m) => s + m.monto, 0);
  if (!total) return null;
  const parte = ingresos.filter((m) => {
    const d = new Date(m.fecha).getDate();
    return d >= desde && d <= hasta;
  });
  return Math.round((parte.reduce((s, m) => s + m.monto, 0) / total) * 100);
}
