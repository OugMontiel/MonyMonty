<script setup>
/**
 * Pantalla de acceso a dos columnas: formulario a la izquierda (slot) y panel
 * informativo a la derecha. En móvil el panel se oculta por CSS (.mm-auth-info).
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
  <div class="mm-root" data-theme="light">
    <div class="mm-auth">
      <div class="mm-auth-form">
        <slot name="cabecera" />
        <div class="col gap-6" :style="{maxWidth: `${ancho}px`, width: '100%'}">
          <slot />
        </div>
        <FooterAuth />
      </div>
      <InfoLogin :start="infoStart" />
    </div>
  </div>
</template>
