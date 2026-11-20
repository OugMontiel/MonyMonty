<script setup>
/**
 * Mensaje de error bajo un campo del formulario. No pinta nada si no hay texto.
 */
import {Icon} from "@iconify/vue";

defineProps({
  texto: {type: String, default: ""},
});
</script>

<template>
  <span v-if="texto" class="err" role="alert"> <Icon icon="ion:alert-circle-outline" :width="14" :height="14" />{{ texto }} </span>
</template>