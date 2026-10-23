<script setup>
/**
 * Contenedor de las pantallas de Mis gastos: carga los movimientos una vez y deja ver la sección
 * elegida (router-view). Usa la misma carga y el mismo mes que los reportes.
 */
import {onMounted} from "vue";

import {cargarDatosReportes} from "@/features/reportes/logic/useReportes.js";

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
