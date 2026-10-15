/**
 * Lectura de extractos bancarios en CSV para importar movimientos. Todo ocurre en el navegador:
 * la API recibe cada movimiento con el mismo POST movimiento del formulario.
 */

export const MAX_FILAS = 500;
export const MAX_BYTES = 5 * 1024 * 1024;

const sinTildes = (t) => String(t ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Divide un texto CSV en filas de celdas; detecta el separador (, ; o tabulación) y respeta las comillas */
export function leerCSV(texto) {
  const limpio = texto.replace(/^﻿/, "");
  const primera = limpio.split(/\r?\n/, 1)[0] ?? "";
  const separador = [";", "\t", ","].map((s) => [s, primera.split(s).length]).sort((a, b) => b[1] - a[1])[0][0];

  const filas = [];
  let fila = [];
  let celda = "";
  let entreComillas = false;

  for (let i = 0; i < limpio.length; i++) {
    const c = limpio[i];
    if (entreComillas) {
      if (c === '"' && limpio[i + 1] === '"') {
        celda += '"';
        i++;
      } else if (c === '"') entreComillas = false;
      else celda += c;
    } else if (c === '"') entreComillas = true;
    else if (c === separador) {
      fila.push(celda.trim());
      celda = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && limpio[i + 1] === "\n") i++;
      fila.push(celda.trim());
      if (fila.some((x) => x !== "")) filas.push(fila);
      fila = [];
      celda = "";
    } else celda += c;
  }
  fila.push(celda.trim());
  if (fila.some((x) => x !== "")) filas.push(fila);

  const [encabezados = [], ...datos] = filas;
  return {encabezados, datos};
}

const PISTAS = {
  fecha: ["fecha", "date", "dia", "f. operacion", "fecha operacion", "fecha transaccion"],
  descripcion: ["descripcion", "detalle", "concepto", "description", "movimiento", "referencia", "glosa"],
  monto: ["valor", "monto", "importe", "amount", "total", "cargo", "debito"],
};

/** Adivina qué columna es cada campo por el nombre del encabezado; devuelve índices o -1 */
export function detectarColumnas(encabezados) {
  const norm = encabezados.map(sinTildes);
  const buscar = (pistas) => {
    const exacta = norm.findIndex((h) => pistas.includes(h));
    return exacta >= 0 ? exacta : norm.findIndex((h) => pistas.some((p) => h.includes(p)));
  };
  return {fecha: buscar(PISTAS.fecha), descripcion: buscar(PISTAS.descripcion), monto: buscar(PISTAS.monto)};
}

/** "28/09/2026", "28-09-26", "2026-09-28" -> Date local (null si no es una fecha válida) */
export function leerFecha(texto) {
  const t = String(texto ?? "").trim();
  let d, m, a;
  let r = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/.exec(t);
  if (r) [, a, m, d] = r;
  else if ((r = /^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/.exec(t))) [, d, m, a] = r;
  else return null;

  a = Number(a) < 100 ? 2000 + Number(a) : Number(a);
  const f = new Date(a, Number(m) - 1, Number(d));
  return f.getFullYear() === a && f.getMonth() === Number(m) - 1 && f.getDate() === Number(d) ? f : null;
}

/** "- $ 214.900", "1.234,56", "(50000)", "-214900" -> número con signo (null si no es un monto) */
export function leerMonto(texto) {
  let t = String(texto ?? "").trim();
  if (!t) return null;
  const negativo = /^\(.*\)$/.test(t) || /^[-−–]/.test(t) || /[-−–]\s*$/.test(t) || /^[$\s]*[-−–]/.test(t);
  t = t.replace(/[^\d.,]/g, "");
  if (!t) return null;

  // El último separador es el decimal si le siguen 1 o 2 dígitos ("1.234,56" o "1,234.56"); si no, es de miles
  const ultimo = Math.max(t.lastIndexOf(","), t.lastIndexOf("."));
  const decimales = ultimo >= 0 ? t.length - ultimo - 1 : 0;
  const numero = ultimo >= 0 && decimales > 0 && decimales <= 2 ? Number(t.slice(0, ultimo).replace(/[.,]/g, "") + "." + t.slice(ultimo + 1)) : Number(t.replace(/[.,]/g, ""));
  if (!Number.isFinite(numero)) return null;
  return negativo ? -numero : numero;
}

const claveDuplicado = (fecha, monto, titulo) => `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}|${Math.abs(monto)}|${sinTildes(titulo)}`;

/**
 * Convierte las filas leídas en movimientos a importar.
 * @param {object} p {datos, mapeo: {fecha, descripcion, monto}, existentes: movimientos ya cargados,
 *                    sugerencias: (titulo) => {categoriaId, subcategoriaId} | null}
 */
export function construirFilas({datos, mapeo, existentes, sugerencias}) {
  const vistos = new Set(existentes.map((m) => claveDuplicado(new Date(m.fecha), m.monto, m.concepto?.titulo ?? "")));
  const filas = [];
  const descartadas = [];

  datos.slice(0, MAX_FILAS).forEach((celdas, i) => {
    const fecha = leerFecha(celdas[mapeo.fecha]);
    const monto = leerMonto(celdas[mapeo.monto]);
    const titulo = (celdas[mapeo.descripcion] ?? "").trim();
    if (!fecha || monto === null || monto === 0) {
      descartadas.push(i + 2); // +2: encabezado y base 1, como se ve en una hoja de cálculo
      return;
    }
    const clave = claveDuplicado(fecha, monto, titulo);
    const duplicado = vistos.has(clave);
    vistos.add(clave);
    filas.push({id: i, fecha, monto, titulo, tipo: monto < 0 ? "EGRESO" : "INGRESO", duplicado, sugerida: sugerencias?.(titulo) ?? null});
  });
  return {filas, descartadas, recortado: datos.length > MAX_FILAS};
}
