import {createRouter, createWebHistory} from "vue-router";

import home from "@/views/paginaWeb/home.vue";
import login from "@/views/paginaInicioDeSeccion/login.vue";
import elTablero from "@/views/paginaDashboard/elTablero.vue";

import crearCuentaNueva from "../views/paginaInicioDeSeccion/paginaCrearCuenta/CrearCuenta.vue";
import recuperarCuentaCliente from "../views/paginaInicioDeSeccion/paginaRecuperarCuenta/RecuperarCuenta.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Vistas login
    {
      path: "/",
      name: "Vista inicial",
      component: login,
    },
    // Vistas de inicio: El tablero
    {
      path: "/Tablero",
      name: "Vista del tablero",
      component: elTablero,
    },
    // Vistas de inicio de sesión
    {
      path: "/login",
      name: "Vista de inicio de sesión",
      component: login,
    },
    {
      path: "/crearCuenta",
      name: "Vista de Crear Cuenta",
      component: crearCuentaNueva,
    },
    {
      path: "/recuperarCuenta",
      name: "Vista de Recuperar Cuenta",
      component: recuperarCuentaCliente,
    },

  ],
});

export default router;
