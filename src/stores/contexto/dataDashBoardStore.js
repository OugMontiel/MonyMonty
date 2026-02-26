import {defineStore} from "pinia";
import {dataMovimientos} from "@/features/dashBoard/logic/movimientos";

// ─── Defaults ────────────────────────────────────────────────────────────────
const defaultState = () => ({
  dataDashBoard: {
    cards: [],
    rankingCategorias: [],
    listaMovimientos: [],
    listaTransacciones: [],
  },
  body: {
    listaMovimientos: {
      page: 1,
      limit: 10,
    },
    listaTransacciones: {
      page: 1,
      limit: 10,
    },
  },
})

export const dataDashBoardStore = defineStore("dataDashBoardStore", {
  // ── State ──────────────────────────────────────────────────────
  state: () => defaultState(),

  // ── Actions ────────────────────────────────────────────────────
  actions: {
    async fetchCards() {
      const {Cars} = dataMovimientos();
      this.dataDashBoard.cards = await Cars();
    },

    async fetchRankingCategorias() {
      const {rankingCategorias} = dataMovimientos();
      this.dataDashBoard.rankingCategorias = await rankingCategorias();
    },

    async fetchListaMovimientos() {
      const {getAllMovimientos} = dataMovimientos();
      const data = await getAllMovimientos(this.body.listaMovimientos.page, this.body.listaMovimientos.limit);
      this.dataDashBoard.listaMovimientos = data.items ?? data;
    },

    async fetchListaTransacciones() {
      const {getAllTransacciones} = dataMovimientos();
      const data = await getAllTransacciones(this.body.listaTransacciones.page, this.body.listaTransacciones.limit);
      this.dataDashBoard.listaTransacciones = data.items ?? data;
    },

    async fetchAll() {
      try {
        await Promise.all([
          this.fetchCards(),
          this.fetchRankingCategorias(),
          this.fetchListaMovimientos(),
          this.fetchListaTransacciones(),
        ]);
      } catch (err) {
        this.error = err.message ?? "Error al cargar movimientos";
      }
    },

    setPageListaMovimientos(page) {
      this.$patch((state) => {
        state.body.listaMovimientos.page = page;
      });
    },

    setLimitListaMovimientos(limit) {
      this.$patch((state) => {
        state.body.listaMovimientos.limit = limit;
      });
    },

    setPageListaTransacciones(page) {
      this.$patch((state) => {
        state.body.listaTransacciones.page = page;
      });
    },

    setLimitListaTransacciones(limit) {
      this.$patch((state) => {
        state.body.listaTransacciones.limit = limit;
      });
    },
  },
});
