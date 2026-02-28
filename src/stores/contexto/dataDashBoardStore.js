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
  pagination: {
    listaMovimientos: {
      totalData: 0,
      page: 1,
      limit: 4,
    },
    listaTransacciones: {
      totalData: 0,
      page: 1,
      limit: 4,
    },
  },
});

export const dataDashBoardStore = defineStore("dataDashBoardStore", {
  // ── State ──────────────────────────────────────────────────────
  state: () => defaultState(),

  // ── Getters ────────────────────────────────────────────────────
  getters: {
    hasRankingCategorias: (state) => state.dataDashBoard.rankingCategorias.length > 0,
  },

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
      const data = await rankingCategorias();
      this.dataDashBoard.rankingCategorias = data.data.data;
      loadingStore.stop("categorias");
    },

    async fetchListaMovimientos() {
      const loadingStore = useLoadingStore();
      const {getAllMovimientos} = dataMovimientos();

      loadingStore.start("dashboardMovimientos");
      const data = await getAllMovimientos(this.pagination.listaMovimientos.page, this.pagination.listaMovimientos.limit, {
        tipo: "STANDARD",
      });
      this.dataDashBoard.listaMovimientos = data.data.data.data;
      this.pagination.listaMovimientos.totalData = data.data.data.total;
      loadingStore.stop("dashboardMovimientos");
    },

    async fetchListaTransacciones() {
      const loadingStore = useLoadingStore();
      const {getAllMovimientos} = dataMovimientos();

      loadingStore.start("dashboardTransferencias");
      const data = await getAllMovimientos(this.pagination.listaTransacciones.page, this.pagination.listaTransacciones.limit, {
        tipo: "TRANSFERENCIA",
      });
      this.dataDashBoard.listaTransacciones = data.data.data.data;
      this.pagination.listaTransacciones.totalData = data.data.data.total;
      loadingStore.stop("dashboardTransferencias");
    },

    async fetchAll() {
      try {
        await Promise.all([this.fetchCards(), this.fetchRankingCategorias(), this.fetchListaMovimientos(), this.fetchListaTransacciones()]);
      } catch (err) {
        this.error = err.message ?? "Error al cargar movimientos";
      }
    },

    setPaginationListaMovimientos({page, limit}) {
      this.pagination.listaMovimientos.page = page;
      this.pagination.listaMovimientos.limit = limit;
    },

    setPaginationListaTransacciones({page, limit}) {
      this.pagination.listaTransacciones.page = page;
      this.pagination.listaTransacciones.limit = limit;
    },
  },
});
