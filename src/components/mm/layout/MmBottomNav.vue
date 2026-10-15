<script setup>
/**
 * Navegación inferior móvil. El CSS del diseño la muestra solo en ≤ 720 px.
 * "Perfil" abre el menú de usuario, que es donde vive "Cerrar sesión".
 */
import {ref} from "vue";
import {useRoute} from "vue-router";

import {useAppUi} from "@/composables/useAppUi.js";
import MmIcon from "../MmIcon.vue";
import MmUserMenu from "./MmUserMenu.vue";

const route = useRoute();
const {nuevoMovimiento} = useAppUi();
const menuAbierto = ref(false);
</script>

<template>
  <nav class="mm-bottomnav" aria-label="Navegación inferior">
    <router-link to="/tablero" :class="{'is-on': route.path.startsWith('/tablero')}"><MmIcon i="grid" :s="22" />Inicio</router-link>
    <router-link to="/movimientos" :class="{'is-on': route.path.startsWith('/movimientos')}"><MmIcon i="swap-horizontal" :s="22" />Movimientos</router-link>
    <button type="button" class="mm-bn-add" aria-label="Nuevo movimiento" @click="nuevoMovimiento"><MmIcon i="add" :s="28" /></button>
    <button type="button" disabled aria-disabled="true" style="opacity: 0.5"><MmIcon i="pie-chart" :s="22" />Planear</button>
    <button type="button" :class="{'is-on': menuAbierto}" aria-haspopup="menu" :aria-expanded="menuAbierto" @click="menuAbierto = !menuAbierto"><MmIcon i="person" :s="22" />Perfil</button>

    <template v-if="menuAbierto">
      <div style="position: fixed; inset: 0; z-index: 11" @click="menuAbierto = false"></div>
      <div class="mm-popover" style="position: fixed; right: 12px; bottom: 92px; width: min(300px, calc(100vw - 24px)); z-index: 12; transform-origin: bottom right">
        <MmUserMenu @cerrar="menuAbierto = false" />
      </div>
    </template>
  </nav>
</template>
