<script setup>
/** Pila de avisos temporales (ver useAvisos). Vive fija en la esquina inferior derecha. */
import {useAvisos} from "@/composables/useAvisos.js";
import MmIcon from "../MmIcon.vue";

const {avisos, cerrar} = useAvisos();

function ejecutarAccion(a) {
  a.accion.ejecutar();
  cerrar(a.id);
}
</script>

<template>
  <div class="mm-root avisos" data-theme="light">
    <div class="mm-toasts" style="position: fixed" role="status" aria-live="polite">
      <div v-for="a in avisos" :key="a.id" class="mm-toast" :style="{'--c': `var(--${a.tono})`}">
        <div class="mm-ico sm" :class="a.tono === 'warning' ? 'warn' : a.tono"><MmIcon :i="a.icono" :s="18" /></div>
        <div class="grow">
          <div class="t-label">{{ a.titulo }}</div>
          <div v-if="a.detalle" class="t-sm muted">{{ a.detalle }}</div>
          <button v-if="a.accion" type="button" class="t-sm accion" @click="ejecutarAccion(a)">{{ a.accion.texto }}</button>
        </div>
        <button type="button" class="mm-x" style="width: 28px; height: 28px" aria-label="Cerrar aviso" @click="cerrar(a.id)"><MmIcon i="close" :s="16" /></button>
        <i class="life" :style="{animationDuration: `${a.duracion}ms`}"></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* El contenedor del layout no debe bloquear clics fuera de los avisos */
.avisos {
  position: fixed;
  right: 0;
  bottom: 0;
  min-height: 0 !important;
  height: 0;
  z-index: 60;
  pointer-events: none;
  background: none;
}
.avisos :deep(.mm-toast) {
  pointer-events: auto;
}
.accion {
  display: inline-block;
  margin-top: 4px;
  border: 0;
  background: none;
  padding: 0;
  color: var(--brand-ink);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}
@media (max-width: 720px) {
  .avisos :deep(.mm-toasts) {
    left: 12px;
    right: 12px;
    bottom: 96px;
    width: auto;
  }
}
</style>
