import {createRouter, createWebHistory} from "vue-router";
import dashboard from "../views/dashboard.vue";
import document from "../views/document.vue";
import NewMov from "../views/NewMov.vue";
import home from "../views/home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "vista inciacial",
      component: home,
    },
    {
      path: "/dashboard",
      name: "vista para todo el tablero ",
      component: dashboard,
    },
    {
      path: "/NewMov",
      name: "Vista para nuevos movimiento",
      component: NewMov,
    },
    {
      path: "/Document",
      name: "Vista de la Documentacion",
      component: document,
    }
  ],
});

export default router;
