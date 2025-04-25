<script>
import Header from "@/components/dashBoard/tablero/header.vue";
import Sidebar from "@/components/dashBoard/tablero/sidebar.vue";
import Footer from "@/components/dashBoard/tablero/footer.vue";
import Background from "@/components/dashBoard/dashboard.vue";

export default {
  name: "ElTablero",
  components: {
    Header,
    Sidebar,
    Footer,
    Background,
  },
};
</script>

<template>
  <div class="el-tablero">
    <Header />
    <div class="main-layout">
      <Sidebar />
      <div class="content">
        <Background />
      </div>
    </div>
    <Footer />
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
