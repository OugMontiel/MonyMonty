<script setup>
/**
 * Contenido del menú de usuario. Se usa en la barra lateral y en la barra inferior móvil.
 * Solo "Cerrar sesión" tiene destino hoy; el resto de opciones se marcan como próximas.
 */
import {computed} from "vue";
import {useRouter} from "vue-router";

import {useAuth} from "@/features/auth/logic/useAuth.js";
import {useUsuario} from "@/composables/useUsuario.js";
import MmIcon from "../MmIcon.vue";

const emit = defineEmits(["cerrar"]);

const router = useRouter();
const {logout} = useAuth();
const {usuario, nombreCompleto, iniciales, plan} = useUsuario();

const correo = computed(() => usuario.value?.email || usuario.value?.correo || "");

async function cerrarSesion() {
  emit("cerrar");
  await logout();
  router.push("/");
}
</script>

<template>
  <div role="menu" aria-label="Menú de usuario">
    <div class="row gap-3" style="padding: 10px 12px 14px">
      <div class="mm-avatar">{{ iniciales }}</div>
      <div class="grow">
        <div class="t-label ellipsis">{{ nombreCompleto || "Mi cuenta" }}</div>
        <div v-if="correo" class="t-xs muted ellipsis">{{ correo }}</div>
      </div>
      <span v-if="plan" class="mm-badge brand">{{ plan }}</span>
    </div>
    <div class="divider" style="margin: 0 0 6px"></div>
    <div class="mm-menu-item is-soon" role="menuitem" aria-disabled="true"><MmIcon i="person" :s="18" /><span class="grow">Mi perfil</span><span class="t-xs muted">Pronto</span></div>
    <div class="mm-menu-item is-soon" role="menuitem" aria-disabled="true"><MmIcon i="settings" :s="18" /><span class="grow">Configuración</span><span class="t-xs muted">Pronto</span></div>
    <div class="divider" style="margin: 6px 0"></div>
    <button type="button" class="mm-menu-item" role="menuitem" style="color: var(--expense); width: 100%; border: 0; background: none; text-align: left" @click="cerrarSesion">
      <MmIcon i="log-out" :s="18" />Cerrar sesión
    </button>
  </div>
</template>

<style scoped>
.is-soon {
  opacity: 0.55;
  cursor: default;
}
</style>
