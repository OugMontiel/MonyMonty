<script setup>
/**
 * Icono Ionicons (outline) del sistema de diseño. Los trazos viven en icons.js,
 * así no depende de la red como el Icon de @iconify/vue.
 */
import {computed} from "vue";
import {ICONS} from "./icons.js";

const props = defineProps({
  // Nombre como en el diseño: "arrow-forward" o "arrow_forward"
  i: {type: String, required: true},
  s: {type: Number, default: 20},
});

const markup = computed(() => ICONS[props.i.replace(/-/g, "_")] ?? "");
const px = computed(() => `${props.s}px`);
</script>

<template>
  <span class="mm-icon" :style="{width: px, height: px}">
    <svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" v-html="markup"></svg>
  </span>
</template>
