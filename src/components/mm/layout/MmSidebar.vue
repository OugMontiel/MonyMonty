<script setup>
/**
 * Barra lateral. Se puede colapsar (botón en el borde o tecla "[") y marca con etiquetas de plan
 * lo que pide Basic o Pro. Solo las pantallas ya construidas son enlaces; el resto aparece como
 * "pronto" para que el menú refleje el diseño completo.
 */
import {computed, ref, onMounted, onBeforeUnmount} from "vue";
import {useRoute} from "vue-router";

import {useAppUi} from "@/composables/useAppUi.js";
import {useUsuario} from "@/composables/useUsuario.js";
import logo from "@/assets/img/MonyMontySinFondo3.png";
import MmIcon from "../MmIcon.vue";
import MmUserMenu from "./MmUserMenu.vue";

const route = useRoute();
const {sidebarColapsada, alternarSidebar} = useAppUi();
const {nombreCompleto, iniciales, plan, planId} = useUsuario();

// minPlan: plan mínimo que desbloquea la sección ("basic" o "pro")
const GRUPOS = [
  {
    titulo: "Resumen",
    items: [
      {id: "tablero", icono: "grid", titulo: "Mi estado actual", ruta: "/tablero"},
      {id: "movimientos", icono: "swap-horizontal", titulo: "Movimientos", ruta: "/movimientos"},
      {id: "reportes", icono: "stats-chart", titulo: "Reportes", ruta: "/reportes", minPlan: "basic"},
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
      {id: "presupuesto", icono: "pie-chart", titulo: "Mi presupuesto", minPlan: "basic"},
      {id: "deudas", icono: "cash", titulo: "Mis deudas", minPlan: "basic"},
      {id: "metas", icono: "flag", titulo: "Metas de ahorro", minPlan: "basic"},
    ],
  },
  {
    titulo: "Crecer",
    items: [
      {id: "aprende", icono: "school", titulo: "Aprende", minPlan: "basic"},
      {id: "mentores", icono: "chatbubbles", titulo: "Mentores", minPlan: "pro"},
    ],
  },
];

// Premium es el plan que en pantalla se llama Pro
const nivel = computed(() => ({free: 0, basic: 1, premium: 2})[planId.value] ?? 0);
const requerido = {basic: 1, pro: 2};
const bloqueado = (item) => Boolean(item.minPlan) && nivel.value < requerido[item.minPlan];
const etiquetaPlan = (item) => (item.minPlan === "pro" ? "Pro" : "Basic");
const pista = (item) => (item.minPlan ? `${item.titulo} · plan ${etiquetaPlan(item)}` : item.titulo);

const esActivo = (item) => item.ruta && route.path.startsWith(item.ruta);

const mensajeUpsell = computed(() => (nivel.value === 0 ? {titulo: "Desbloquea Basic", texto: "Presupuesto, deudas, metas, reportes y Aprende 1–8."} : nivel.value === 1 ? {titulo: "Pasa a Pro", texto: "Mentores, talleres en vivo y Aprende 9–15."} : null));

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
    <div class="mm-side-head">
      <img v-if="!sidebarColapsada" class="mm-logo" :src="logo" alt="MonyMonty" style="height: 36px; width: auto" />
      <div v-else class="mm-ico brand" aria-label="MonyMonty"><b>M</b></div>
      <button
        type="button"
        class="mm-side-toggle"
        :aria-label="sidebarColapsada ? 'Expandir menú' : 'Colapsar menú'"
        :aria-expanded="!sidebarColapsada"
        :title="`${sidebarColapsada ? 'Expandir' : 'Colapsar'} menú · tecla [`"
        @click="alternarSidebar"
      >
        <MmIcon :i="sidebarColapsada ? 'chevron-forward' : 'chevron-back'" :s="16" />
      </button>
    </div>

    <nav class="mm-nav" aria-label="Menú principal">
      <template v-for="g in GRUPOS" :key="g.titulo">
        <div class="mm-nav-group t-over">{{ g.titulo }}</div>
        <template v-for="item in g.items" :key="item.id">
          <router-link v-if="item.ruta" :to="item.ruta" class="mm-nav-item" :class="{'is-active': esActivo(item)}" :title="pista(item)" :data-tip="pista(item)">
            <MmIcon :i="item.icono" :s="20" /><span>{{ item.titulo }}</span>
            <b v-if="item.minPlan" class="mm-plan-tag" :class="[item.minPlan, {'is-locked': bloqueado(item)}]"><MmIcon v-if="bloqueado(item)" i="lock-closed" :s="10" />{{ etiquetaPlan(item) }}</b>
          </router-link>
          <div v-else class="mm-nav-item is-soon" aria-disabled="true" :title="`${pista(item)} · pronto`" :data-tip="`${pista(item)} · pronto`">
            <MmIcon :i="item.icono" :s="20" /><span>{{ item.titulo }}</span>
            <b v-if="item.minPlan" class="mm-plan-tag" :class="[item.minPlan, {'is-locked': bloqueado(item)}]"><MmIcon v-if="bloqueado(item)" i="lock-closed" :s="10" />{{ etiquetaPlan(item) }}</b>
          </div>
        </template>
      </template>
    </nav>

    <div ref="pie" class="mm-side-foot" style="position: relative">
      <div v-if="mensajeUpsell && !sidebarColapsada" class="mm-upsell mm-side-hide">
        <div class="row gap-2" style="position: relative; z-index: 1"><b class="mm-plan-tag pro" style="margin: 0"><MmIcon i="sparkles" :s="10" />Pro</b><span class="t-label">{{ mensajeUpsell.titulo }}</span></div>
        <div class="t-sm muted" style="position: relative; z-index: 1; margin: 6px 0 4px">{{ mensajeUpsell.texto }}</div>
      </div>

      <div v-if="menuAbierto" class="mm-popover" style="left: 0; bottom: calc(100% + 8px); width: 280px; transform-origin: bottom left">
        <MmUserMenu @cerrar="menuAbierto = false" />
      </div>
      <button type="button" class="mm-user" style="border: 0; background: none; width: 100%; text-align: left" :title="`${nombreCompleto}${plan ? ` · Plan ${plan}` : ''}`" :aria-expanded="menuAbierto" aria-haspopup="menu" @click="menuAbierto = !menuAbierto">
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
