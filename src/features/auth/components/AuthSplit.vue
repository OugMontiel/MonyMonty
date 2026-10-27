<script setup>
/**
 * Pantalla de acceso a dos columnas: formulario a la izquierda (slot) y panel
 * informativo a la derecha. Por debajo de 960px el panel se oculta por CSS (.auth-info).
 */
import InfoLogin from "./infoLogin.vue";
import FooterAuth from "./FooterAuth.vue";

defineProps({
  // Tarjeta del carrusel con la que abre el panel
  infoStart: {type: Number, default: 0},
  // Ancho máximo del contenido del formulario
  ancho: {type: Number, default: 400},
});
</script>

<template>
  <div class="tema" data-theme="light">
    <div class="auth">
      <div class="auth-form">
        <!-- Logo, formulario y pie comparten la misma columna para quedar alineados y centrados -->
        <div class="auth-col" :style="{maxWidth: `${ancho}px`}">
          <slot name="cabecera" />
          <div class="col gap-6">
            <slot />
          </div>
          <FooterAuth />
        </div>
      </div>
      <InfoLogin :start="infoStart" />
    </div>
  </div>
</template>
