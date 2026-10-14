<script setup>
/**
 * Mis cuentas (S17 lista · S24 tarjetas horizontales). Los saldos se calculan con los movimientos
 * porque GET entidad solo devuelve el nombre de cada cuenta.
 */
import {useAppUi} from "@/composables/useAppUi.js";
import {useTablero} from "../../logic/useTablero.js";
import {moneda, TIPOS_ENTIDAD, ENTIDAD_GENERICA} from "../../logic/formato.js";
import MmIcon from "@/components/mm/MmIcon.vue";

defineProps({
  // "lista" para escritorio, "tarjetas" para el carrusel móvil
  variante: {type: String, default: "lista"},
});

const {cuentas} = useTablero();
const {nuevaCuenta} = useAppUi();

const tipoDe = (c) => TIPOS_ENTIDAD[c.tipo] ?? ENTIDAD_GENERICA;
const detalle = (c) => (c.numero ? `•••• ${c.numero}` : tipoDe(c).etiqueta);
</script>

<template>
  <div v-if="variante === 'lista'" class="mm-card mm-rise" style="--i: 7">
    <div class="mm-card-h">
      <h3 class="t-h3">Mis cuentas</h3>
      <button type="button" class="mm-btn icon sm" aria-label="Nueva cuenta" @click="nuevaCuenta"><MmIcon i="add" :s="18" /></button>
    </div>
    <div v-if="!cuentas.length" class="mm-empty" style="padding: 16px 8px">
      <p class="t-sm muted">Aún no tienes cuentas.</p>
      <button type="button" class="mm-btn sm primary" @click="nuevaCuenta"><MmIcon i="add" :s="16" />Crear cuenta</button>
    </div>
    <div v-else class="mm-list">
      <div v-for="c in cuentas" :key="c.id" class="mm-row">
        <div class="mm-ico sm cat" :style="{background: tipoDe(c).color}"><MmIcon :i="tipoDe(c).icono" :s="18" /></div>
        <div class="grow"><div class="t ellipsis">{{ c.nombre }}</div><div class="s">{{ detalle(c) }}</div></div>
        <b class="t-amt" :class="{expense: c.saldo < 0}">{{ moneda(c.saldo, c.divisaId) }}</b>
      </div>
    </div>
  </div>

  <div v-else-if="cuentas.length" class="row" style="gap: 10px; overflow-x: auto; padding-bottom: 4px">
    <div v-for="c in cuentas" :key="c.id" :style="{flex: 'none', width: '180px', borderRadius: '16px', padding: '14px', color: '#fff', background: tipoDe(c).color}">
      <div class="t-xs ellipsis" style="opacity: 0.85">{{ c.nombre }}</div>
      <div class="t-h3 num" style="margin-top: 18px">{{ moneda(c.saldo, c.divisaId) }}</div>
    </div>
  </div>
</template>
