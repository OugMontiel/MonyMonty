<script setup>
/**
 * Indicador de progreso del registro: "Paso X de N" y una barra con un tramo por paso.
 */
import {computed} from "vue";
import {PASOS_REGISTRO} from "../logic/registroConstants.js";

const props = defineProps({
  paso: {type: Number, required: true},
});

const total = PASOS_REGISTRO.length;
const siguiente = computed(() => (props.paso < total ? `Siguiente: ${PASOS_REGISTRO[props.paso].toLowerCase()}` : "Último paso"));
const barras = computed(() => PASOS_REGISTRO.map((_, k) => (k + 1 < props.paso ? "done" : k + 1 === props.paso ? "on" : "")));
</script>

<template>
  <div class="col gap-3">
    <div class="row between t-xs">
      <b>Paso {{ paso }} de {{ total }} · {{ PASOS_REGISTRO[paso - 1] }}</b>
      <span class="muted">{{ siguiente }}</span>
    </div>
    <div class="steps" aria-hidden="true">
      <i v-for="(estado, k) in barras" :key="k" :class="estado"></i>
    </div>
  </div>
</template>
