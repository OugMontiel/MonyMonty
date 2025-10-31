<script setup>
/**
 * ============================================================
 * Autor: Diego Alejandro Montiel Flórez
 * Proyecto: MonyMonty
 * Descripción: Este código es propiedad intelectual de
 * Diego Alejandro Montiel Flórez. Su uso, copia o distribución
 * sin autorización está estrictamente prohibido.
 * ============================================================
 */
import {computed, ref, onMounted} from "vue";

const currentYear = computed(() => new Date().getFullYear());

const mensajes = ["“El dinero es un terrible amo, pero un excelente sirviente.” — P.T. Barnum",];

// Estado reactivo para el mensaje actual
const mensajeActual = ref("");

// Selecciona aleatoriamente un mensaje al montar el componente
onMounted(() => {
  if (mensajes.length > 0) {
    const indice = Math.floor(Math.random() * mensajes.length);
    mensajeActual.value = mensajes[indice];
  }
});
</script>
<template>
  <footer class="w-full flex flex-col items-center gap-2 text-center text-xs">
    <Message severity="secondary" variant="simple" class="w-full max-w-md italic leading-snug sm:whitespace-nowrap ">
      {{ mensajeActual }}
    </Message>
    <p class="text-[11px] text-gray-500 dark:text-gray-400">
      &copy; {{ currentYear }} <span class="font-semibold text-primary"> MonyMonty</span>. Todos los derechos reservados.
    </p>
  </footer>
</template>
