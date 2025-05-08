import {createRouter, createWebHistory} from "vue-router";
import home from "@/views/paginaWeb/home.vue";
import login from "@/views/paginaInicioDeSeccion/login.vue";
import elTablero from "@/views/paginaDashboard/elTablero.vue";
import crearCuentaNueva from "../views/paginaInicioDeSeccion/paginaCrearCuenta/CrearCuenta.vue";
import recuperarCuenta from "../views/paginaInicioDeSeccion/paginaRecuperarCuenta/RecuperarCuentar.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Vistas estáticas informativas
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
      path: "/crearNuevaCuenta",
      name: "Vista de Crear Cuenta",
      component: crearCuentaNueva,
    },
    {
      path: "/recuperarCuenta",
      name: "Vista de Crear Cuenta",
      component: recuperarCuenta,
    },

  ],
});

export default router;
