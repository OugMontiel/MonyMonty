<script setup>
/**
 * Contenedor de todas las pantallas de Reportes: carga los datos una vez y deja ver la pestaña
 * elegida (router-view). Reportes es de Basic en adelante: con plan Free se muestra una vista
 * que explica qué incluye, sin pedir los datos.
 */
import {computed, watch} from "vue";

import {useUsuario} from "@/composables/useUsuario.js";
import {cargarDatosReportes} from "../logic/useReportes.js";
import ReportesFree from "./ReportesFree.vue";

const {planId} = useUsuario();
// planId llega vacío mientras se carga el usuario: solo se bloquea cuando es "free" de verdad
const bloqueado = computed(() => planId.value === "free");

watch(bloqueado, (b) => { if (!b) cargarDatosReportes(); }, {immediate: true});
</script>

<template>
  <div class="mm-page">
    <ReportesFree v-if="bloqueado" />
    <router-view v-else />
  </div>
</template>

<style scoped>
.mm-page {
  display: contents;
}
</style>
