<script setup>
/** Mis gastos cuando todavía no hay ningún gasto registrado: explica qué se verá y cómo empezar. */
import {useRouter} from "vue-router";

import MmIcon from "@/components/mm/MmIcon.vue";
import {useAppUi} from "@/composables/useAppUi.js";

const router = useRouter();
const {nuevoMovimiento} = useAppUi();

// Barras fantasma que sugieren el gráfico que aparecerá con los primeros gastos
const FANTASMA = [40, 62, 52, 78, 58, 30];

const irAImportar = () => router.push({path: "/movimientos", query: {importar: "1"}});
</script>

<template>
  <div class="col gap-6">
    <div class="mm-card mm-rise" style="padding: 40px; position: relative; overflow: hidden">
      <div class="mm-float" style="position: absolute; width: 300px; height: 300px; border-radius: 50%; right: -80px; top: -120px; background: var(--expense-tint)"></div>
      <div class="row" style="position: relative; flex-wrap: wrap; gap: 40px; align-items: center">
        <div class="col grow gap-3" style="min-width: 320px; max-width: 560px">
          <span class="mm-badge" style="align-self: flex-start">Aún no hay gastos registrados</span>
          <h2 class="t-h1" style="font-size: 32px; line-height: 38px">Descubre a dónde se va tu plata</h2>
          <p class="muted">Con tus primeros 3 gastos te mostramos en qué categoría gastas más, tu promedio diario y cómo vas frente al mes anterior.</p>
          <div class="row gap-2" style="flex-wrap: wrap; margin-top: 6px">
            <button type="button" class="mm-btn primary lg" @click="nuevoMovimiento"><MmIcon i="add" :s="18" />Registrar mi primer gasto</button>
            <button type="button" class="mm-btn lg" @click="irAImportar"><MmIcon i="download" :s="18" />Importar extracto</button>
          </div>
        </div>
        <div aria-hidden="true" style="flex: 1 1 300px; display: flex; align-items: flex-end; gap: 12px; height: 180px; opacity: 0.55">
          <i v-for="(h, k) in FANTASMA" :key="k" class="mm-popin" :style="{'--i': k, flex: 1, height: `${h}%`, borderRadius: '10px 10px 4px 4px', background: 'repeating-linear-gradient(-45deg, var(--surface-3) 0 6px, var(--surface-2) 6px 12px)'}"></i>
        </div>
      </div>
    </div>

    <div class="grid g2">
      <router-link class="mm-card hover mm-rise" to="/gastos/fijos" style="--i: 1; text-decoration: none; color: inherit">
        <div class="mm-ico info"><MmIcon i="calendar" :s="20" /></div>
        <h3 class="t-h3" style="margin-top: 12px">Empieza por lo fijo</h3>
        <p class="t-sm muted" style="margin-top: 4px">Arriendo, servicios y suscripciones: agrégalos una vez y verás cuándo se cobra cada uno.</p>
      </router-link>
      <button type="button" class="mm-card hover mm-rise tarjeta" style="--i: 2" @click="irAImportar">
        <div class="mm-ico balance"><MmIcon i="download" :s="20" /></div>
        <h3 class="t-h3" style="margin-top: 12px">Trae tu historial</h3>
        <p class="t-sm muted" style="margin-top: 4px">Importa el extracto de tu banco en CSV y tus gastos aparecen de una vez.</p>
      </button>
    </div>

    <div class="mm-card flat mm-rise" style="--i: 3; background: var(--surface-2); border: 0">
      <div class="row gap-3"><span class="mm-kbd">N</span><span class="t-sm muted">Desde cualquier pantalla abre el formulario de movimiento. Registrar en el momento toma menos de 5 segundos.</span></div>
    </div>
  </div>
</template>

<style scoped>
.tarjeta {
  display: block;
  align-self: stretch;
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
</style>
