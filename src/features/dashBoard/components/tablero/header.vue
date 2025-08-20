<script>
import Perfil from "@/features/dashBoard/components/perfilusuario/perfilUser.vue"; 

export default {
  name: "Header",
  components: {
    Perfil,
  },
};
</script>

<template>
  <header class="header">
    <div class="headerLeft">
      <!-- <h2>Izquierda</h2> -->
    </div>
    <div class="headerCenter">
      <h1>Centro</h1>
    </div>
    <div class="headerRight">
      <Perfil />
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
}

.headerCenter {
  flex: 1; /* Cada sección ocupa el mismo espacio */
  text-align: center; /* Centra el texto en cada sección */
}

.headerRight {
  text-align: right; /* Alinea el texto a la derecha */
}
.headerLeft {
  text-align: left; /* Alinea el texto a la izquierda */
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
