import {createRouter, createWebHistory} from "vue-router";
import { useAuth } from "@/features/auth/logic/useAuth.js";

import login from "@/features/auth/views/LoginView.vue";
import elTablero from "@/views/paginaDashboard/elTableroView.vue";

import crearCuentaNueva from "../features/auth/views/CrearCuentaView.vue";
import recuperarCuentaCliente from "../features/auth/views/RecuperarCuentaView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /**
     *  Rutas públicas
     * 
     * */ 
    {
      path: "/",
      name: "Login",
      component: login,
      meta: { requiresAuth: false },
    },
    {
      path: "/crearCuenta",
      name: "CrearCuenta",
      component: crearCuentaNueva,
      meta: { requiresAuth: false },
    },
    {
      path: "/recuperarCuenta",
      name: "RecuperarCuenta",
      component: recuperarCuentaCliente,
      meta: { requiresAuth: false },
    },
    // Ruta 404
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      redirect: "/",
      meta: { requiresAuth: false },
    },
     /**
     *  Rutas protegidas
     * 
     * */ 
    // Vistas de inicio: El tablero
    {
      path: "/tablero",
      name: "HomeTablero",
      component: elTablero,
      meta: { requiresAuth: true },
    },
  ],
});

// Guard de navegación optimizado
router.beforeEach(async (to, from, next) => {
  const { checkAuth, isAuthenticated } = useAuth();
  
  // Verificar si la ruta necesita autenticación (por defecto sí)
  const requiresAuth = to.meta.requiresAuth !== false;
  
  if (requiresAuth) {
    // Verificar autenticación solo si no sabemos el estado actual
    if (!isAuthenticated.value) {
      const authValid = await checkAuth();
      if (!authValid) {
        next('/');
        return;
      }
    }
    next();
  } else {
    // Ruta pública
    // Si está autenticado y va al login, redirigir al tablero
    if ((to.path === '/') && isAuthenticated.value) {
      next('/tablero');
      return;
    }
    next();
  }
});

export default router;
