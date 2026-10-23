/**
 * Rangos de fechas por periodo (semana, mes, año) y el periodo anterior equivalente.
 * Los usan el tablero y la lista de movimientos.
 */
const finDelDia = (y, m, d) => new Date(y, m, d, 23, 59, 59, 999);

/** Rango {inicio, fin} del periodo que contiene `base`. La semana empieza el lunes. */
export function rangoDe(p, base = new Date()) {
  const y = base.getFullYear();
  const m = base.getMonth();
  if (p === "semana") {
    const lunes = new Date(y, m, base.getDate() - ((base.getDay() + 6) % 7));
    return {inicio: lunes, fin: finDelDia(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + 6)};
  }
  if (p === "anio") return {inicio: new Date(y, 0, 1), fin: finDelDia(y, 11, 31)};
  return {inicio: new Date(y, m, 1), fin: finDelDia(y, m + 1, 0)};
}

/** Una fecha cualquiera dentro del periodo anterior a `base` */
export function baseAnterior(p, base = new Date()) {
  if (p === "semana") return new Date(base.getFullYear(), base.getMonth(), base.getDate() - 7);
  if (p === "anio") return new Date(base.getFullYear() - 1, 0, 1);
  return new Date(base.getFullYear(), base.getMonth() - 1, 1);
}

/** Rango de "los últimos N días" contando hoy */
export function ultimosDias(n, base = new Date()) {
  const inicio = new Date(base.getFullYear(), base.getMonth(), base.getDate() - (n - 1));
  return {inicio, fin: finDelDia(base.getFullYear(), base.getMonth(), base.getDate())};
}

export const inicioDelDia = (fecha) => new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
export const finDeDia = (fecha) => finDelDia(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
