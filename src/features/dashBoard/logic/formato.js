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
