import {createRouter, createWebHistory} from "vue-router";
import { useAuth } from "@/router/useAuth";

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

    // Vistas login
    {
      path: "/",
      name: "Vista inicial",
      component: login,
      meta: { requiresAuth: false },
    },
    // Vistas de inicio de sesión
    {
      path: "/login",
      name: "Vista de inicio de sesión",
      redirect: "/",
      meta: { requiresAuth: false },
    },
    {
      path: "/crearCuenta",
      name: "Vista de Crear Cuenta",
      component: crearCuentaNueva,
      meta: { requiresAuth: false },
    },
    {
      path: "/recuperarCuenta",
      name: "Vista de Recuperar Cuenta",
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
      name: "Vista del tablero",
      component: elTablero,
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
