import {createRouter, createWebHistory} from "vue-router";
import {useAuth} from "../features/auth/logic/useAuth.js";

import login from "../features/auth/views/LoginView.vue";
import crearCuentaNueva from "../features/auth/views/CrearCuentaView.vue";
import recuperarCuentaCliente from "../features/auth/views/RecuperarCuentaView.vue";
import CambioDeClave from "../features/auth/views/CambioDeClave.vue";

// configuraciÃ³n inicial tras el registro
import OnboardingView from "../features/onboarding/views/OnboardingView.vue";

// layaut 
import elTablero from "../features/dashBoard/views/elTablero.vue";

//rutas base 
import Dashboard from "../features/dashBoard/views/Dashboard.vue";
import ReportesLayout from "../features/reportes/views/ReportesLayout.vue";
import ReportesResumen from "../features/reportes/views/ReportesResumen.vue";
import ReportesFlujo from "../features/reportes/views/ReportesFlujo.vue";
import ReportesCategorias from "../features/reportes/views/ReportesCategorias.vue";
import ReportesPatrimonio from "../features/reportes/views/ReportesPatrimonio.vue";
import MovimientosView from "../features/movimientos/views/MovimientosView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /**
     *  Rutas pÃºblicas
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

    /**
     *  ConfiguraciÃ³n inicial (requiere sesiÃ³n: crea la cuenta y las categorÃ­as del usuario)
     *
     * */
    {
      path: "/bienvenida",
      redirect: "/bienvenida/divisa",
    },
    {
      path: "/bienvenida/:paso(divisa|cuenta|categorias|listo)",
      name: "Onboarding",
      component: OnboardingView,
      meta: {requiresAuth: true},
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
    // Pantallas con el layout principal (barra lateral, búsqueda, acciones rápidas…).
    // Los hijos usan rutas absolutas para que las URLs sean /tablero, /movimientos, etc.
    {
      path: "/app",
      name: "Layout",
      component: elTablero,
      redirect: "/tablero",
      meta: {requiresAuth: true},
      children: [
        {path: "/tablero", name: "DashboardView", component: Dashboard},
        {path: "/movimientos", name: "Movimientos", component: MovimientosView},
        {
          path: "/reportes",
          component: ReportesLayout,
          children: [
            {path: "", name: "ReportesResumen", component: ReportesResumen},
            {path: "flujo", name: "ReportesFlujo", component: ReportesFlujo},
            {path: "categorias", name: "ReportesCategorias", component: ReportesCategorias},
            {path: "patrimonio", name: "ReportesPatrimonio", component: ReportesPatrimonio},
          ],
        },
      ],
    },
  ],
});

// Guard de navegaciÃ³n optimizado
router.beforeEach(async (to, from) => {
  const {checkAuth} = useAuth();

  // Verificar si la ruta necesita autenticaciÃ³n (por defeczto sÃ­)
  const requiresAuth = to.meta.requiresAuth !== false;
  const authValid = await checkAuth();

  if (requiresAuth && !authValid) {
    return {name: "Login"};
  }

  if (to.name === "Login" && authValid) {
    return {name: "DashboardView"};
  }
});

export default router;


