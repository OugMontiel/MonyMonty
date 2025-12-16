import {createRouter, createWebHistory} from "vue-router";
import {useAuth} from "../features/auth/logic/useAuth.js";

import login from "../features/auth/views/LoginView.vue";
import crearCuentaNueva from "../features/auth/views/CrearCuentaView.vue";
import recuperarCuentaCliente from "../features/auth/views/RecuperarCuentaView.vue";
import CambioDeClave from "../features/auth/views/CambioDeClave.vue";

// layaut 
import elTablero from "../features/dashBoard/views/elTablero.vue";

//rutas base 
import Dashboard from "../features/dashBoard/views/Dashboard.vue";
import Customers from "../features/dashBoard/views/Customers.vue";
import Messages from "../features/dashBoard/views/Messages.vue";
import Help from "../features/dashBoard/views/Help.vue";
import Settings from "../features/dashBoard/views/Settings.vue";



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
      meta: {requiresAuth: false},
    },
    {
      path: "/crearCuenta",
      name: "CrearCuenta",
      component: crearCuentaNueva,
      meta: {requiresAuth: false},
    },
    {
      path: "/recuperarCuenta",
      name: "RecuperarCuenta",
      component: recuperarCuentaCliente,
      meta: {requiresAuth: false},
    },
    {
      path: "/resetPassword",
      name: "resetPassword",
      component: CambioDeClave,
      meta: {requiresAuth: false},
    },
    // Ruta 404
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      redirect: "/",
      meta: {requiresAuth: false},
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
      meta: {requiresAuth: true},
      children: [
        {
          path: "",
          name: "DashboardView",
          component: Dashboard,
          meta: { title: "Dashboard" },
        },
        {
          path: "/customers",
          name: "customersView",
          component: Customers,
          meta: { title: "Customers" },
        },
         {
          path: "/messages",
          name: "MessagesView",
          component: Messages,
          meta: { title: "Messages" },
        },
        {
          path: "/help",
          name: "HelpView",
          component: Help,
          meta: { title: "Help" },
        },
        {
          path: "/settings",
          name: "SettingsView",
          component: Settings,
          meta: { title: "Settings" },
        },
      ],
    },
  ],
});

// Guard de navegación optimizado
router.beforeEach(async (to, from) => {
  const {checkAuth} = useAuth();

  // Verificar si la ruta necesita autenticación (por defeczto sí)
  const requiresAuth = to.meta.requiresAuth !== false;
  const authValid = await checkAuth();

  if (requiresAuth && !authValid) {
    return {name: "Login"};
  }

  if (to.name === "Login" && authValid) {
    return {name: "HomeTablero"};
  }
});

export default router;
