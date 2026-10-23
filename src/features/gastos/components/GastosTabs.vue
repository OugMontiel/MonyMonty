<script setup>
/**
 * Secciones de Mis gastos y selector del mes que se mira. El mes es el mismo que usan los reportes
 * (useReportes): al pasar de una pantalla a otra se conserva.
 */
import MmIcon from "@/components/mm/MmIcon.vue";
import {useReportes} from "@/features/reportes/logic/useReportes.js";

defineProps({
  // id de la sección activa
  activa: {type: String, required: true},
  // Con false no se muestra el selector de mes (secciones que no dependen del mes)
  conMes: {type: Boolean, default: true},
});

const SECCIONES = [{id: "resumen", etiqueta: "Resumen", icono: "stats-chart", ruta: "/gastos"}];

const {etiquetaMes, esMesActual, moverMes} = useReportes();
</script>

<template>
  <div class="row" style="flex-wrap: wrap; gap: 16px; align-items: flex-end; border-bottom: 1px solid var(--line)">
    <nav class="mm-tabs grow" aria-label="Secciones de gastos" style="border: 0">
      <router-link v-for="s in SECCIONES" :key="s.id" :to="s.ruta" :class="{'is-on': s.id === activa}" :aria-current="s.id === activa ? 'page' : undefined">
        <MmIcon :i="s.icono" :s="16" />{{ s.etiqueta }}
      </router-link>
    </nav>
    <div v-if="conMes" class="row gap-2" style="padding-bottom: 10px">
      <button type="button" class="mm-btn sm icon" aria-label="Mes anterior" @click="moverMes(-1)"><MmIcon i="chevron-back" :s="16" /></button>
      <b class="t-label" style="min-width: 118px; text-align: center" aria-live="polite">{{ etiquetaMes }}</b>
      <button type="button" class="mm-btn sm icon" aria-label="Mes siguiente" :disabled="esMesActual" @click="moverMes(1)"><MmIcon i="chevron-forward" :s="16" /></button>
    </div>
  </div>
</template>
