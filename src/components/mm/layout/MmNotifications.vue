<script setup>
/**
 * Panel de notificaciones (S22). La API aún no tiene avisos, así que muestra el estado vacío
 * del diseño; cuando existan, las filas se renderizan en `notificaciones` con el mismo marcado.
 */
import {ref, watch, nextTick} from "vue";

import {useAppUi} from "@/composables/useAppUi.js";
import MmIcon from "../MmIcon.vue";

const {notificacionesAbiertas} = useAppUi();
const notificaciones = ref([]); // Pendiente: llegará desde la API
const panel = ref(null);

const cerrar = () => (notificacionesAbiertas.value = false);

watch(notificacionesAbiertas, async (abierto) => {
  if (!abierto) return;
  await nextTick();
  panel.value?.focus();
});
</script>

<template>
  <div v-if="notificacionesAbiertas" class="mm-root" data-theme="light">
    <div class="mm-overlay right" @click.self="cerrar">
      <div ref="panel" class="mm-drawer" role="dialog" aria-modal="true" aria-labelledby="notif-titulo" tabindex="-1" style="width: min(440px, 100%); outline: 0" @keydown.esc="cerrar">
        <div class="mm-modal-h" style="padding-bottom: 12px">
          <div class="mm-ico brand"><MmIcon i="notifications" :s="22" /></div>
          <div class="grow">
            <h2 id="notif-titulo" class="t-h2">Notificaciones</h2>
            <p class="t-sm muted">{{ notificaciones.length ? `${notificaciones.length} en total` : "Estás al día" }}</p>
          </div>
          <button type="button" class="mm-x" aria-label="Cerrar" @click="cerrar"><MmIcon i="close" :s="20" /></button>
        </div>

        <div style="border-top: 1px solid var(--line); flex: 1; overflow: auto">
          <div v-if="!notificaciones.length" class="mm-empty">
            <div class="art" style="width: 96px; height: 96px">
              <div class="mm-ico lg brand mm-float" style="width: 56px; height: 56px; border-radius: 18px"><MmIcon i="notifications" :s="26" /></div>
            </div>
            <h3 class="t-h3">Sin notificaciones por ahora</h3>
            <p class="t-sm muted" style="max-width: 300px">Aquí verás los avisos importantes de tu cuenta apenas lleguen.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
