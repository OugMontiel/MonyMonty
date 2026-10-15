<script setup>
/**
 * Pestañas de Reportes y selector del periodo que se está mirando (año o mes según la pestaña).
 * El periodo se comparte entre pestañas: al cambiar de pestaña se conserva el mes o el año elegido.
 */
import {computed} from "vue";

import MmIcon from "@/components/mm/MmIcon.vue";
import {PESTANAS, useReportes} from "../logic/useReportes.js";

const props = defineProps({
  // id de la pestaña activa
  activa: {type: String, required: true},
});

const {anio, etiquetaMes, esMesActual, esAnioActual, moverMes, moverAnio} = useReportes();

const pestana = computed(() => PESTANAS.find((p) => p.id === props.activa));
const porAnio = computed(() => pestana.value?.modo === "anio");
const rango = computed(() => (porAnio.value ? String(anio.value) : etiquetaMes.value));
const alFinal = computed(() => (porAnio.value ? esAnioActual.value : esMesActual.value));

const anterior = () => (porAnio.value ? moverAnio(-1) : moverMes(-1));
const siguiente = () => (porAnio.value ? moverAnio(1) : moverMes(1));
</script>

<template>
  <div class="row" style="flex-wrap: wrap; gap: 16px; align-items: flex-end; border-bottom: 1px solid var(--line)">
    <nav class="mm-tabs grow" aria-label="Tipos de reporte" style="border: 0; flex-wrap: wrap; row-gap: 4px">
      <router-link v-for="t in PESTANAS" :key="t.id" :to="t.ruta" :class="{'is-on': t.id === activa}" :aria-current="t.id === activa ? 'page' : undefined">
        <MmIcon :i="t.icono" :s="16" />{{ t.etiqueta }}
      </router-link>
    </nav>
    <div class="row gap-2" style="padding-bottom: 10px">
      <button type="button" class="mm-btn sm icon" :aria-label="porAnio ? 'Año anterior' : 'Mes anterior'" @click="anterior"><MmIcon i="chevron-back" :s="16" /></button>
      <b class="t-label" style="min-width: 92px; text-align: center" aria-live="polite">{{ rango }}</b>
      <button type="button" class="mm-btn sm icon" :aria-label="porAnio ? 'Año siguiente' : 'Mes siguiente'" :disabled="alFinal" @click="siguiente"><MmIcon i="chevron-forward" :s="16" /></button>
    </div>
  </div>
</template>
