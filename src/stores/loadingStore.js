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
});
