import {defineStore} from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    auth: false,
    categorias: false,
    // Dashboard specific states
    dashboardCards: false,
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
