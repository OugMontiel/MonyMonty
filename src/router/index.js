import {createRouter, createWebHistory} from "vue-router";
import home from "@/views/paginaWeb/home.vue";
import login from "@/views/paginaInicioDeSeccion/login.vue";
import elTablero from "@/views/paginaDashboard/elTablero.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Vistas estáticas informativas
    {
      path: "/",
      name: "Vista inicial",
      component: home,
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

    // Vistas de nu evo presupuesto

    // Vistas de seguimiento de presupuestos

    // Vistas de nuevos movimientos
    // {
    //   path: "/NewMov",
    //   name: "Vista para nuevos movimientos",
    //   component: NewMov,
    // },
    // Vistas de seguimiento de movimientos
    // {
    //   path: "/transacciones",
    //   name: "Vista para todo el tablero",
    //   component: transacciones,
    // },
    // Vistas de reportes

    // Vistas de configuración
  ],
});

export default router;
