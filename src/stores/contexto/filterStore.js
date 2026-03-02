import {defineStore} from "pinia";
import {DateTime} from "luxon";

// ─── Defaults ────────────────────────────────────────────────────────────────
const defaultRange = () => ([
  DateTime.now().startOf("month").toJSDate(),
  DateTime.now().endOf("month").toJSDate()
]);

const defaultState = () => ({
  dateRange: defaultRange(),
  cuentas: [],
  monedas: [],
  categorias: [],
});

// ─── Transform ──────────────────────────────────────────────────────────────
const transformQuery = (state) => {
  const q = {
    fechaInicio: state.fechaInicio,
    fechaFin: state.fechaFin,
  };

  // Solo incluye los filtros opcionales si tienen elementos
  if (state.cuentas.length) q.cuentas = [...state.cuentas];
  if (state.monedas.length) q.monedas = [...state.monedas];
  if (state.categorias.length) q.categorias = [...state.categorias];

  return q;
};

// ─── Store ──────────────────────────────────────────────────────────────────
export const useDashboardFilters = defineStore("filter", {
  state: () => defaultState(),
  getters: {
    fechaInicio: (state) => state.dateRange?.[0] ?? null,
    fechaFin: (state) => state.dateRange?.[1] ?? null,
    /**
     * Query reactivo listo para enviar a la API.
     * Se recalcula automáticamente cada vez que cambia cualquier filtro.
     */
    query: (state) => transformQuery(state),
  },

  actions: {
    setDateRange(range) {
      this.dateRange = range ?? defaultRange()
    },

    clearDates() {
      this.dateRange = defaultRange()
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
