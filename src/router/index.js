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
      meta: { requieresAuth: true},
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

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // Si la ruta requiere autenticación y no hay token
  if (to.meta.requiresAuth && !token) {
    next({ path: "/login" }); // redirige al login
  } else if ((to.path === "/login" || to.path === "/") && token) {
    // Si ya está autenticado y va al login o raíz, lo mandas al tablero
    next({ path: "/tablero" });
  } else {
    next(); // permite continuar
  }
});

export default router;
