import {reactive, computed} from "vue";

import {periodo} from "../../dashBoard/logic/useTablero.js";
import {describirMovimiento, cuentaDeMovimiento} from "../../dashBoard/logic/formato.js";
import {rangoDe, baseAnterior, ultimosDias, inicioDelDia, finDeDia} from "./periodos.js";

/**
 * Filtros de la lista de movimientos. La API filtra por tipo, fechas, cuentas, monedas y categorías;
 * como todavía no filtra por texto ni por monto, esos dos (y el resto, sobre los datos ya cargados)
 * se aplican aquí para que la lista responda al instante.
 */
export const PRESETS_FECHA = [
  {id: "hoy", etiqueta: "Hoy"},
  {id: "7d", etiqueta: "7 días"},
  {id: "mes", etiqueta: "Este mes"},
  {id: "mesPasado", etiqueta: "Mes pasado"},
  {id: "personalizado", etiqueta: "Personalizado"},
];

export const filtros = reactive({
  texto: "",
  // INGRESO | EGRESO | TRANSFERENCIA; null = todos
  tipo: null,
  // Si es null se usa el periodo del selector de la barra superior (semana, mes o año)
  preset: null,
  desde: "", // yyyy-mm-dd (solo con preset "personalizado")
  hasta: "",
  cuentas: [], // ids de entidad
  categorias: [], // ids de categoría
  montoMin: null,
  montoMax: null,
});

/** "2026-10-08" -> Date local a medianoche */
function fechaDeInput(valor) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

/** Rango de fechas efectivo: el preset del panel de filtros o, si no hay, el periodo de la barra superior */
export function rangoEfectivo() {
  const hoy = new Date();
  switch (filtros.preset) {
    case "hoy":
      return {inicio: inicioDelDia(hoy), fin: finDeDia(hoy)};
    case "7d":
      return ultimosDias(7, hoy);
    case "mes":
      return rangoDe("mes", hoy);
    case "mesPasado":
      return rangoDe("mes", baseAnterior("mes", hoy));
    case "personalizado": {
      const d = fechaDeInput(filtros.desde);
      const h = fechaDeInput(filtros.hasta);
      return {inicio: d ?? new Date(0), fin: h ? finDeDia(h) : finDeDia(hoy)};
    }
    default:
      return rangoDe(periodo.value, hoy);
  }
}

const sinTildes = (t) => String(t ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function coincideTexto(m, q) {
  const {titulo, detalle} = describirMovimiento(m);
  return sinTildes([titulo, detalle, m.concepto?.detalle, m.subcategoria?.subcategoria, cuentaDeMovimiento(m), String(m.monto), ...(m.tags ?? [])].join(" ")).includes(q);
}

function idsDeCuenta(m) {
  return [m.entidadId, m.transferencia?.origenEntidadId, m.transferencia?.destinoEntidadId].filter(Boolean);
}

/**
 * Filtra `lista`. Con `ignorar` se omite un grupo ("tipo" o "fecha") para contar lo que habría
 * en cada opción del panel sin tocar los demás filtros.
 */
export function aplicarFiltros(lista, {ignorar = []} = {}) {
  const {inicio, fin} = rangoEfectivo();
  const q = sinTildes(filtros.texto.trim());

  return lista.filter((m) => {
    if (!ignorar.includes("fecha")) {
      const f = new Date(m.fecha);
      if (f < inicio || f > fin) return false;
    }
    if (!ignorar.includes("tipo") && filtros.tipo && m.tipo !== filtros.tipo) return false;
    if (filtros.cuentas.length && !idsDeCuenta(m).some((id) => filtros.cuentas.includes(id))) return false;
    if (filtros.categorias.length && !filtros.categorias.includes(m.categoriaId)) return false;
    if (filtros.montoMin !== null && filtros.montoMin !== "" && m.monto < Number(filtros.montoMin)) return false;
    if (filtros.montoMax !== null && filtros.montoMax !== "" && m.monto > Number(filtros.montoMax)) return false;
    if (q && !coincideTexto(m, q)) return false;
    return true;
  });
}

/** Cantidad de grupos de filtros activos (lo que muestra el contador del botón "Filtros") */
export const filtrosActivos = computed(
  () =>
    [
      filtros.preset !== null,
      filtros.tipo !== null,
      filtros.cuentas.length > 0,
      filtros.categorias.length > 0,
      (filtros.montoMin !== null && filtros.montoMin !== "") || (filtros.montoMax !== null && filtros.montoMax !== ""),
    ].filter(Boolean).length
);

export function limpiarFiltros() {
  filtros.tipo = null;
  filtros.preset = null;
  filtros.desde = "";
  filtros.hasta = "";
  filtros.cuentas = [];
  filtros.categorias = [];
  filtros.montoMin = null;
  filtros.montoMax = null;
}

/** Agrega o quita un valor de una lista de filtros (cuentas o categorías) */
export function alternarEn(lista, valor) {
  const i = lista.indexOf(valor);
  if (i >= 0) lista.splice(i, 1);
  else lista.push(valor);
}
