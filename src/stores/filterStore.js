import { defineStore } from "pinia";
import {DateTime} from "luxon";

// ─── Defaults ────────────────────────────────────────────────────────────────
const defaultState = () => ({
  fechaInicio:  DateTime.now().startOf("month").toJSDate(), // 01/MM/YYYY 00:00:00
  fechaFin:    DateTime.now().endOf("month").toJSDate(),   // último día  23:59:59
  cuentas:   [],
  monedas: [],
  categorias: [],
});

// ─── Transform ──────────────────────────────────────────────────────────────
const transformQuery = (state) => {
  const q = {
    fechaInicio: state.fechaInicio,
    fechaFin:   state.fechaFin,
  };

  // Solo incluye los filtros opcionales si tienen elementos
  if (state.cuentas.length)   q.cuentas   = [...state.cuentas];
  if (state.monedas.length) q.monedas = [...state.monedas];
  if (state.categorias.length) q.categorias = [...state.categorias];

  return q;
}

// ─── Store ──────────────────────────────────────────────────────────────────
export const useDashboardFilters = defineStore("filter", {
  state: () => defaultState(),
  getters: {
    /**
     * Query reactivo listo para enviar a la API.
     * Se recalcula automáticamente cada vez que cambia cualquier filtro.
     */
    query: (state) => transformQuery(state),
  },

  actions: {
    setFechaInicio(date) {
      this.fechaInicio = date;
    },
    setFechaFin(date) {
      this.fechaFin = date;
    },
    setCuentas(accounts = []) {
      this.cuentas = [...accounts];
    },
    setMonedas(currencies = []) {
      this.monedas = [...currencies];
    },
    setCategorias(categories = []) {
      this.categorias = [...categories];
    },

    /** Resetea todos los filtros a sus valores por defecto */
    resetAllFilters() {
      this.$patch(defaultState());
    },
  },
});
