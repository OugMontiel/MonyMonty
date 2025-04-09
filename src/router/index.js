import {createRouter, createWebHistory} from "vue-router";
import dashboard from "../views/estaticas/dashboard.vue";
import document from "../views/documentation.vue";
import NewMov from "../views/movimientos/newMovemet.vue";
import home from "../views/estaticas/home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // vistas estaticas inforamtivas
    {
      path: "/",
      name: "vista inciacial",
      component: home,
    },
    // vista estaticas Documentacion
    {
      path: "/Document",
      name: "Vista de la Documentacion",
      component: document,
    },
    // vistas de inicio
    {
      path: "/dashboard",
      name: "vista para todo el tablero ",
      component: dashboard,
    },
    // vistas de incio de seccion

    // vistas de presupuesto

    // vistas de seguimiento de presupuesto

    // vistas de seguimiento de movimiento
    {
      path: "/NewMov",
      name: "Vista para nuevos movimiento",
      component: NewMov,
    },
    // vistas de reportes

    // vistas de configuracion
  ],
});

export default router;
