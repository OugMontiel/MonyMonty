<script setup>
/**
 * Barra lateral (S17 expandida · S20 colapsada). Solo "Mi estado actual" tiene pantalla hoy;
 * las demás entradas se muestran como "Pronto" para que el menú ya refleje el diseño completo.
 */
import {ref, onMounted, onBeforeUnmount} from "vue";
import {useRoute} from "vue-router";

import {useAppUi} from "@/composables/useAppUi.js";
import {useUsuario} from "@/composables/useUsuario.js";
import logo from "@/assets/img/MonyMontySinFondo3.png";
import MmIcon from "../MmIcon.vue";
import MmUserMenu from "./MmUserMenu.vue";

const route = useRoute();
const {sidebarColapsada, alternarSidebar} = useAppUi();
const {nombreCompleto, iniciales, plan} = useUsuario();

const GRUPOS = [
  {
    titulo: "Resumen",
    items: [
      {id: "tablero", icono: "grid", titulo: "Mi estado actual", ruta: "/tablero"},
      {id: "movimientos", icono: "swap-horizontal", titulo: "Movimientos"},
      {id: "reportes", icono: "stats-chart", titulo: "Reportes"},
    ],
  },
  {
    titulo: "Mi dinero",
    items: [
      {id: "gastos", icono: "trending-down", titulo: "Mis gastos"},
      {id: "ingresos", icono: "trending-up", titulo: "Mis ingresos"},
      {id: "cuentas", icono: "wallet", titulo: "Mis cuentas"},
      {id: "categorias", icono: "pricetags", titulo: "Categorías"},
    ],
  },
  {
    titulo: "Planear",
    items: [
      {id: "presupuesto", icono: "pie-chart", titulo: "Mi presupuesto"},
      {id: "deudas", icono: "cash", titulo: "Mis deudas"},
      {id: "metas", icono: "flag", titulo: "Metas de ahorro"},
      {id: "aprende", icono: "school", titulo: "Aprende"},
    ],
  },
];

const esActivo = (item) => item.ruta && route.path.startsWith(item.ruta);

// Menú de usuario: se cierra con clic fuera o Escape
const menuAbierto = ref(false);
const pie = ref(null);

function alClicFuera(e) {
  if (menuAbierto.value && pie.value && !pie.value.contains(e.target)) menuAbierto.value = false;
}
function alTeclear(e) {
  if (e.key === "Escape") menuAbierto.value = false;
}

onMounted(() => {
  document.addEventListener("click", alClicFuera);
  document.addEventListener("keydown", alTeclear);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", alClicFuera);
  document.removeEventListener("keydown", alTeclear);
});
</script>

<template>
  <aside class="mm-side" :class="{'is-collapsed': sidebarColapsada}">
    <div class="row between">
      <img v-if="!sidebarColapsada" class="mm-logo" :src="logo" alt="MonyMonty" style="height: 36px; width: auto" />
      <div v-else class="mm-ico brand" style="margin: 0 auto" aria-label="MonyMonty"><b>M</b></div>
      <button
        v-if="!sidebarColapsada"
        type="button"
        class="mm-btn icon sm ghost mm-side-hide"
        aria-label="Contraer menú"
        @click="alternarSidebar"
      >
        <MmIcon i="chevron-back" :s="18" />
      </button>
    </div>
    <button v-if="sidebarColapsada" type="button" class="mm-btn icon sm ghost" style="align-self: center" aria-label="Expandir menú" @click="alternarSidebar">
      <MmIcon i="chevron-forward" :s="18" />
    </button>

    <nav class="mm-nav" aria-label="Menú principal">
      <template v-for="g in GRUPOS" :key="g.titulo">
        <div class="mm-nav-group t-over">{{ g.titulo }}</div>
        <router-link v-for="item in g.items.filter((i) => i.ruta)" :key="item.id" :to="item.ruta" class="mm-nav-item" :class="{'is-active': esActivo(item)}" :title="item.titulo">
          <MmIcon :i="item.icono" :s="20" /><span>{{ item.titulo }}</span>
        </router-link>
        <div v-for="item in g.items.filter((i) => !i.ruta)" :key="item.id" class="mm-nav-item is-soon" aria-disabled="true" :title="`${item.titulo} · pronto`">
          <MmIcon :i="item.icono" :s="20" /><span>{{ item.titulo }}</span>
        </div>
      </template>
    </nav>

    <div ref="pie" class="mm-side-foot" style="position: relative">
      <div v-if="menuAbierto" class="mm-popover" style="left: 0; bottom: calc(100% + 8px); width: 280px; transform-origin: bottom left">
        <MmUserMenu @cerrar="menuAbierto = false" />
      </div>
      <button type="button" class="mm-user" style="border: 0; background: none; width: 100%; text-align: left" :aria-expanded="menuAbierto" aria-haspopup="menu" @click="menuAbierto = !menuAbierto">
        <div class="mm-avatar">{{ iniciales }}</div>
        <div class="grow mm-side-hide">
          <div class="t-label ellipsis">{{ nombreCompleto || "Mi cuenta" }}</div>
          <div v-if="plan" class="t-xs muted" style="font-weight: 500">Plan {{ plan }}</div>
        </div>
        <span class="mm-side-hide muted"><MmIcon i="ellipsis-vertical" :s="18" /></span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.is-soon {
  opacity: 0.5;
  cursor: default;
}
.is-soon:hover {
  background: none;
  color: var(--ink-muted);
}
.is-soon:hover svg {
  transform: none;
}
</style>
