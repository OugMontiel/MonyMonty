import {ICONS} from "@/components/mm/icons.js";

/** Divisas que no usan decimales al mostrarse */
const SIN_DECIMALES = ["COP", "CLP", "PYG", "JPY"];

export function moneda(valor, divisa = "COP") {
  const n = Number(valor) || 0;
  const sin = SIN_DECIMALES.includes(divisa);
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: divisa,
      minimumFractionDigits: sin ? 0 : 2,
      maximumFractionDigits: sin ? 0 : 2,
    })
      .format(n)
      .replace(/ /g, " ");
  } catch {
    // Código de divisa que Intl no conoce
    return `${divisa} ${new Intl.NumberFormat("es-CO").format(n)}`;
  }
}

/** Monto con signo para filas de movimientos: "− $ 24.500", "+ $ 1.200.000" o sin signo en transferencias */
export function montoConSigno(mov) {
  const texto = moneda(mov.monto, mov.divisaId);
  if (mov.tipo === "EGRESO") return `− ${texto}`;
  if (mov.tipo === "INGRESO") return `+ ${texto}`;
  return texto;
}

/** 5817300 -> "5,82 M"; valores menores a un millón van en miles ("820 mil") */
export function compacto(valor) {
  const n = Math.abs(Number(valor) || 0);
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString("es-CO", {maximumFractionDigits: 2})} M`;
  if (n >= 1_000) return `${Math.round(n / 1_000).toLocaleString("es-CO")} mil`;
  return n.toLocaleString("es-CO");
}

export function porcentaje(n, decimales = 1) {
  return `${(Number(n) || 0).toLocaleString("es-CO", {maximumFractionDigits: decimales})} %`;
}

/** "ion:cart-outline" (formato que guarda la API) -> nombre del icono del diseño, o un genérico */
export function iconoDe(ion, porDefecto = "pricetags") {
  if (!ion) return porDefecto;
  const nombre = String(ion).replace(/^ion:/, "").replace(/-outline$/, "");
  return ICONS[nombre.replace(/-/g, "_")] ? nombre : porDefecto;
}

const ES_MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const nombreMes = (fecha) => ES_MESES[fecha.getMonth()];
export const nombreMesCorto = (fecha) => ES_MESES[fecha.getMonth()].slice(0, 3).replace(/^./, (c) => c.toUpperCase());
export const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1);

function mismoDia(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** "1:12 p. m." / "Ayer, 7:30 p. m." / "30 sep" */
export function fechaCorta(valor, ahora = new Date()) {
  const f = new Date(valor);
  if (Number.isNaN(f.getTime())) return "";
  const hora = f.toLocaleTimeString("es-CO", {hour: "numeric", minute: "2-digit"});
  const ayer = new Date(ahora);
  ayer.setDate(ahora.getDate() - 1);

  if (mismoDia(f, ahora)) return hora;
  if (mismoDia(f, ayer)) return `Ayer, ${hora}`;
  return `${f.getDate()} ${nombreMesCorto(f).toLowerCase()}`;
}

/** Título y subtítulo de una fila de movimiento, a partir de lo que devuelve POST movimiento/list */
export function describirMovimiento(mov) {
  if (mov.tipo === "TRANSFERENCIA") {
    const o = mov.transferenciaDetalle?.origen?.nombre;
    const d = mov.transferenciaDetalle?.destino?.nombre;
    return {
      titulo: mov.concepto?.titulo || "Transferencia",
      detalle: o && d ? `Transferencia · ${o} → ${d}` : "Transferencia",
    };
  }
  const cat = mov.categoria?.categoria;
  const cuenta = mov.entidad?.nombre;
  return {
    titulo: mov.concepto?.titulo || (mov.esSistema ? "Saldo inicial" : mov.subcategoria?.subcategoria || cat || "Movimiento"),
    detalle: [cat, cuenta].filter(Boolean).join(" · "),
  };
}

/** Color de la tarjeta de cuenta según su tipo */
export const TIPOS_ENTIDAD = {
  BANCO: {etiqueta: "Banco", icono: "business", color: "var(--cat-sky)"},
  EFECTIVO: {etiqueta: "Efectivo", icono: "cash", color: "var(--cat-green)"},
  COOPERATIVA: {etiqueta: "Cooperativa", icono: "people", color: "var(--cat-indigo)"},
};
export const ENTIDAD_GENERICA = {etiqueta: "Cuenta", icono: "wallet", color: "var(--cat-slate)"};

/** GET entidad solo devuelve una etiqueta "TIPO - nombre - número" (o solo el nombre si no hay número) */
export function parseLabelEntidad(label = "") {
  const partes = label.split(" - ");
  if (partes.length >= 3) return {tipo: partes[0], nombre: partes.slice(1, -1).join(" - "), numero: partes[partes.length - 1]};
  return {tipo: null, nombre: label, numero: ""};
}

/** Presentación de cada tipo de movimiento de la API (EGRESO, INGRESO, TRANSFERENCIA) */
export const TIPOS_MOVIMIENTO = {
  EGRESO: {etiqueta: "Gasto", tono: "expense", icono: "trending-down", clase: ""},
  INGRESO: {etiqueta: "Ingreso", tono: "income", icono: "trending-up", clase: "income"},
  TRANSFERENCIA: {etiqueta: "Transferencia", tono: "info", icono: "swap-horizontal", clase: "info"},
};

const mismoDiaCal = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** "jueves 8 de octubre" */
function diaLargo(f) {
  return f.toLocaleDateString("es-CO", {weekday: "long", day: "numeric", month: "long"}).replace(",", "");
}

/** Encabezado de un grupo de la lista: "Hoy · jueves 8 de octubre", "Ayer · …" o "Lunes 5 de octubre" */
export function tituloDia(valor, ahora = new Date()) {
  const f = new Date(valor);
  const ayer = new Date(ahora);
  ayer.setDate(ahora.getDate() - 1);
  if (mismoDiaCal(f, ahora)) return `Hoy · ${diaLargo(f)}`;
  if (mismoDiaCal(f, ayer)) return `Ayer · ${diaLargo(f)}`;
  return capitalizar(diaLargo(f));
}

export const horaCorta = (valor) => new Date(valor).toLocaleTimeString("es-CO", {hour: "numeric", minute: "2-digit"});

/** "Hoy, jueves 8 de octubre · 1:12 p. m." */
export function fechaLarga(valor, ahora = new Date()) {
  const f = new Date(valor);
  const ayer = new Date(ahora);
  ayer.setDate(ahora.getDate() - 1);
  const prefijo = mismoDiaCal(f, ahora) ? "Hoy, " : mismoDiaCal(f, ayer) ? "Ayer, " : "";
  const dia = diaLargo(f);
  return `${prefijo}${prefijo ? dia : capitalizar(dia)} · ${horaCorta(f)}`;
}

/** Color e icono de la categoría de un movimiento (las transferencias van en azul con la flecha doble) */
export const colorMovimiento = (m) => (m.tipo === "TRANSFERENCIA" ? "var(--cat-sky)" : m.categoria?.color || "var(--cat-slate)");
export const iconoMovimiento = (m) => (m.tipo === "TRANSFERENCIA" ? "swap-horizontal" : iconoDe(m.categoria?.icono));

/** Nombre de la cuenta (entidad) de un movimiento, o "Origen → Destino" en transferencias */
export function cuentaDeMovimiento(m) {
  if (m.tipo === "TRANSFERENCIA") {
    const o = m.transferenciaDetalle?.origen?.nombre;
    const d = m.transferenciaDetalle?.destino?.nombre;
    return o && d ? `${o} → ${d}` : "Entre cuentas";
  }
  return m.entidad?.nombre ?? "";
}

/**
 * Da formato de miles (es-CO) a lo que se escribe en un campo de monto. Con `decimales` acepta una
 * coma decimal (para divisas distintas al peso colombiano); sin ellos solo deja dígitos.
 */
export function formatearMontoTexto(texto, decimales = false) {
  const limpio = String(texto).replace(decimales ? /[^\d,]/g : /\D/g, "");
  const [entero = "", ...resto] = limpio.split(",");
  const miles = entero.replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (!decimales || !resto.length) return miles;
  return `${miles || "0"},${resto.join("").slice(0, 2)}`;
}

/** "1.234,5" -> 1234.5 (0 si no es un número) */
export function leerMontoTexto(texto) {
  const n = Number(String(texto).replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

/** 48900 -> "48.900" (para mostrar un monto existente en el campo) */
export function montoATexto(valor, decimales = false) {
  return Number.isFinite(Number(valor)) && Number(valor) !== 0
    ? new Intl.NumberFormat("es-CO", {maximumFractionDigits: decimales ? 2 : 0}).format(Number(valor))
    : "";
}
