<script>
import HeaderView from "@/features/dashBoard/components/tablero/header.vue";
import SidebarView from "@/features/dashBoard/components/tablero/sidebar.vue";
import NavBarraFooter from "@/features/dashBoard/components/tablero/navBarraFooter.vue";
import BackgroundView from "@/features/dashBoard/components/dashBoardMovimiento/dashboardView.vue";

import Ingresos from "@/features/dashBoard/views/ingresosView.vue";
import Gastos from "@/features/dashBoard/views/gastosView.vue";
import Resumen from "@/features/dashBoard/views/resumenView.vue";
import Presupuesto from "@/features/dashBoard/views/presupuestoView.vue";


export default {
  name: "ElTablero",
  components: {
    HeaderView,
    SidebarView,
    NavBarraFooter,
    Ingresos,
    Gastos,
    Presupuesto,
    Resumen,
  },
  data() {
    return {
      activeSection: "ingresos",
    };
  },
   computed: {
    componenteActivo() {
      const mapa = {
        ingresos: "Ingresos",
        gastos: "Gastos",
        presupuesto: "Presupuesto",
        resumen: "Resumen",
      };
      return mapa[this.activeSection] || "Ingresos";
    },
  },
  methods: {
    cambiarSeccion(nueva) {
      this.seccionActiva = nueva;
    },
  },
};
</script>

<template>
  <div class="el-tablero">
    <HeaderView />
    <div class="main-layout">
      <div class="content">
        <component :is="componenteActivo" />
      </div>
    </div>
    <NavBarraFooter @cambiar-seccion="cambiarSeccion" />
  </div>
</template>

<style scoped>
.el-tablero {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-layout {
  display: flex;
  flex: 1;
}

.content {
  flex: 1;
  overflow: auto;
}

/* Extra pequeño: móviles pequeños (xs) */
@media (max-width: 575.98px) {
  /* Estilos para móviles pequeños */
}

/* Pequeño: móviles medianos y grandes (sm) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Estilos para móviles medianos/grandes */
}

/* Mediano: tablets (md) */
@media (min-width: 768px) and (max-width: 991.98px) {
  /* Estilos para tablets */
}

/* Grande: laptops (lg) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  /* Estilos para laptops */
}

/* Extra grande: pantallas grandes (xl) */
@media (min-width: 1200px) and (max-width: 1399.98px) {
  /* Estilos para pantallas grandes */
}

/* XXL: monitores muy grandes */
@media (min-width: 1400px) {
  /* Estilos para pantallas muy grandes */
}
</style>
