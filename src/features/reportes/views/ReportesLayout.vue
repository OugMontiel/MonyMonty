<script setup>
/**
 * Contenedor de todas las pantallas de Reportes: carga los datos una vez y deja ver la pestaña
 * elegida (router-view). Aquí viven también las piezas que comparten todas las pestañas.
 */
import {onMounted} from "vue";

import {cargarDatosReportes} from "../logic/useReportes.js";

onMounted(cargarDatosReportes);
</script>

<template>
  <div class="mm-page">
    <router-view />
  </div>
</template>

<style scoped>
.mm-page {
  display: contents;
}
</style>
