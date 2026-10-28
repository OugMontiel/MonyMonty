<script setup>
import {computed, ref} from "vue";

import TerminosCondicionesDrawer from "./modales/terminosCondiciones.vue";
import PoliticaPrivacidadDrawer from "./modales/politicaPrivacidad.vue";

const currentYear = computed(() => new Date().getFullYear());

// Los textos legales completos viven en estos dos paneles; se abren desde el pie
const showCondiciones = ref(false);
const showPrivacidad = ref(false);
</script>

<template>
  <footer class="t-xs muted row gap-4" style="flex-wrap: wrap">
    <button type="button" class="footer-link" @click="showCondiciones = true">Términos</button>
    <button type="button" class="footer-link" @click="showPrivacidad = true">Privacidad</button>
    <span>&copy; {{ currentYear }} MonyMonty</span>
    <TerminosCondicionesDrawer v-model="showCondiciones" />
    <PoliticaPrivacidadDrawer v-model="showPrivacidad" />
  </footer>
</template>

<style scoped>
.footer-link {
  border: 0;
  padding: 0;
  background: none;
  font-weight: 600;
  color: var(--ink-muted);
}
.footer-link:hover {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
