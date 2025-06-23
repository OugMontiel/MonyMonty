import {createRouter, createWebHistory} from "vue-router";

import login from "@/features/auth/views/LoginView.vue";
import elTablero from "@/views/paginaDashboard/elTableroView.vue";

import crearCuentaNueva from "../features/auth/views/CrearCuentaView.vue";
import recuperarCuentaCliente from "../features/auth/views/RecuperarCuentaView.vue";

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
      path: "/tablero",
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
