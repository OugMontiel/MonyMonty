<script setup>
/**
 * Barra superior de las pantallas autenticadas: migas, título, selector de periodo,
 * búsqueda (Ctrl K), notificaciones y botón principal. En móvil pasa a avatar + saludo.
 */
import {computed} from "vue";

import {useAppUi} from "@/composables/useAppUi.js";
import {useUsuario} from "@/composables/useUsuario.js";
import MmIcon from "../MmIcon.vue";

const props = defineProps({
  migas: {type: String, default: ""},
  titulo: {type: String, required: true},
  // Si es null no se muestra el selector de periodo
  periodo: {type: String, default: null},
  cta: {type: String, default: "Nuevo"},
});
const emit = defineEmits(["update:periodo"]);

const {busquedaAbierta, notificacionesAbiertas, nuevoMovimiento} = useAppUi();
const {iniciales, primerNombre} = useUsuario();

const PERIODOS = [
  {id: "semana", etiqueta: "Semana"},
  {id: "mes", etiqueta: "Mes"},
  {id: "anio", etiqueta: "Año"},
];
const indice = computed(() => Math.max(0, PERIODOS.findIndex((p) => p.id === props.periodo)));
</script>

<template>
  <header class="mm-top" style="flex-wrap: wrap">
    <div class="mm-avatar mm-only-mobile">{{ iniciales }}</div>
    <div class="grow">
      <div class="mm-crumb mm-only-mobile">Hola{{ primerNombre ? `, ${primerNombre}` : "" }}</div>
      <div v-if="migas" class="mm-crumb mm-only-desktop">{{ migas }}</div>
      <h1 class="t-h1">{{ titulo }}</h1>
    </div>

    <div v-if="periodo" class="mm-seg" role="group" aria-label="Periodo" :style="{'--n': 3, '--on': indice}">
      <i class="thumb"></i>
      <button v-for="p in PERIODOS" :key="p.id" type="button" :class="{'is-on': periodo === p.id}" :aria-pressed="periodo === p.id" @click="emit('update:periodo', p.id)">
        {{ p.etiqueta }}
      </button>
    </div>

    <button type="button" class="mm-btn" style="width: 220px; justify-content: flex-start; color: var(--ink-muted); font-weight: 600" @click="busquedaAbierta = true">
      <MmIcon i="search" :s="18" /><span class="grow" style="text-align: left">Buscar…</span><span class="mm-kbd">Ctrl</span><span class="mm-kbd">K</span>
    </button>
    <button type="button" class="mm-btn icon mm-only-mobile" aria-label="Buscar" @click="busquedaAbierta = true"><MmIcon i="search" :s="20" /></button>
    <button type="button" class="mm-btn icon" aria-label="Notificaciones" @click="notificacionesAbiertas = true"><MmIcon i="notifications" :s="20" /></button>
    <button v-if="cta" type="button" class="mm-btn primary" @click="nuevoMovimiento"><MmIcon i="add" :s="20" />{{ cta }}</button>
  </header>
</template>

<style scoped>
/* En móvil avatar, saludo, búsqueda y campana van en una sola fila */
@media (max-width: 720px) {
  .mm-top {
    flex-wrap: nowrap !important;
  }
  .mm-top > .grow {
    min-width: 0;
  }
}
</style>
