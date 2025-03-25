import {createRouter, createWebHistory} from "vue-router";
import dashboard from "../views/dashboard.vue";
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
  ],
});

export default router;
