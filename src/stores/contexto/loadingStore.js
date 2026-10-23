import {defineStore} from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    auth: false,

    // Dashboard specific states
    dashboardCards: false,
    categorias: false,
    dashboardMovimientos: false,
    dashboardTransferencias: false,

    // Creation states
    createCategoria: false,
    createEntidad: false,
    createMovimiento: false,
    optionsMovimiento: false,
  }),
  actions: {
    start(key) {
      this[key] = true;
    },
    stop(key) {
      this[key] = false;
    },
  },
});
