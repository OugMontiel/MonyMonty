import { defineStore } from "pinia";
import {DateTime} from "luxon";

// ─── Defaults ────────────────────────────────────────────────────────────────
const defaultState = () => ({
  dateStart:  DateTime.now().startOf("month").toJSDate(), // 01/MM/YYYY 00:00:00
  dateEnd:    DateTime.now().endOf("month").toJSDate(),   // último día  23:59:59
  accounts:   [],
  currencies: [],
  categories: [],
});

// ─── Transform ──────────────────────────────────────────────────────────────
const transformQuery = (state) => {
  const q = {
    dateStart: state.dateStart,
    dateEnd:   state.dateEnd,
  };

  // Solo incluye los filtros opcionales si tienen elementos
  if (state.accounts.length)   q.accounts   = [...state.accounts];
  if (state.currencies.length) q.currencies = [...state.currencies];
  if (state.categories.length) q.categories = [...state.categories];

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
    setDateStart(date) {
      this.dateStart = date;
    },
    setDateEnd(date) {
      this.dateEnd = date;
    },
    setAccounts(accounts = []) {
      this.accounts = [...accounts];
    },
    setCurrencies(currencies = []) {
      this.currencies = [...currencies];
    },
    setCategories(categories = []) {
      this.categories = [...categories];
    },

    /**
     * Actualiza uno o varios filtros en una sola llamada.
     *
     * @param {Partial<ReturnType<typeof defaultState>>} partial
     *
     * @example
     * store.setFilters({ currencies: ['USD'], dateStart: new Date() })
     */
    setFilters(partial = {}) {
      Object.assign(this, partial);
    },

    /** Resetea todos los filtros a sus valores por defecto */
    resetAllFilters() {
      Object.assign(this, defaultState());
    },
  },
});
