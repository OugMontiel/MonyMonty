import {defineStore} from "pinia";
import {dataMovimientos} from "@/features/dashBoard/logic/movimientos";
import {useLoadingStore} from "./loadingStore";

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
      const loadingStore = useLoadingStore();
      const {cars} = dataMovimientos();

      loadingStore.start("dashboardCards");
      const data = await cars();
      this.dataDashBoard.cards = data.data.data;
      loadingStore.stop("dashboardCards");
    },

    async fetchRankingCategorias() {
      const loadingStore = useLoadingStore();
      const {rankingCategorias} = dataMovimientos();

      loadingStore.start("categorias");
      this.dataDashBoard.rankingCategorias = await rankingCategorias();
      loadingStore.stop("categorias");
    },

    async fetchListaMovimientos() {
      const loadingStore = useLoadingStore();
      const {getAllMovimientos} = dataMovimientos();

      loadingStore.start("dashboardMovimientos");
      const data = await getAllMovimientos(this.body.listaMovimientos.page, this.body.listaMovimientos.limit);
      this.dataDashBoard.listaMovimientos = data.items ?? data;
      loadingStore.stop("dashboardMovimientos");
    },

    async fetchListaTransacciones() {
      const loadingStore = useLoadingStore();
      const {getAllTransacciones} = dataMovimientos();

      loadingStore.start("dashboardTransferencias");
      const data = await getAllTransacciones(this.body.listaTransacciones.page, this.body.listaTransacciones.limit);
      this.dataDashBoard.listaTransacciones = data.items ?? data;
      loadingStore.stop("dashboardTransferencias");
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
