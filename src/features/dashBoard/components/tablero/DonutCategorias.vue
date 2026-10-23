<script setup>
/** Gasto por categoría: dona con las 5 categorías que más pesan y el resto agrupado en "Otros". */
import {computed} from "vue";

import {moneda, compacto} from "../../logic/formato.js";

const props = defineProps({
  // Respuesta de POST movimiento/ranking: [{labelCategoria, montoCategoria, colorCategoria}] ya ordenada por monto
  ranking: {type: Array, required: true},
  divisa: {type: String, default: "COP"},
});

const MAX_CATEGORIAS = 5;
const RADIO = 63;
const PALETA = ["var(--cat-teal)", "var(--cat-indigo)", "var(--cat-orange)", "var(--cat-amber)", "var(--cat-sky)", "var(--cat-pink)"];

const total = computed(() => props.ranking.reduce((s, c) => s + c.montoCategoria, 0));

const filas = computed(() => {
  const principales = props.ranking.slice(0, MAX_CATEGORIAS).map((c, i) => ({
    nombre: c.labelCategoria,
    monto: c.montoCategoria,
    color: c.colorCategoria || PALETA[i % PALETA.length],
  }));
  const resto = props.ranking.slice(MAX_CATEGORIAS).reduce((s, c) => s + c.montoCategoria, 0);
  if (resto > 0) principales.push({nombre: "Otros", monto: resto, color: "var(--surface-3)"});

  let acumulado = 0;
  return principales.map((f) => {
    const pct = total.value ? (f.monto / total.value) * 100 : 0;
    const fila = {...f, pct, etiqueta: pct > 0 && pct < 1 ? "<1 %" : `${Math.round(pct)} %`, offset: -acumulado};
    acumulado += pct;
    return fila;
  });
});
</script>

<template>
  <div v-if="!ranking.length" class="mm-empty" style="padding: 24px 8px">
    <h4 class="t-h3">Sin gastos en este periodo</h4>
    <p class="t-sm muted">Cuando registres gastos verás aquí a qué categorías se va tu plata.</p>
  </div>

  <div v-else class="row gap-4" style="align-items: center; flex-wrap: wrap">
    <div class="mm-ring" style="width: 150px; height: 150px">
      <svg class="mm-donut" width="150" height="150" viewBox="0 0 150 150" role="img" aria-label="Gasto por categoría">
        <circle cx="75" cy="75" :r="RADIO" style="fill: none; stroke: var(--surface-2); stroke-width: 16"></circle>
        <circle
          v-for="(f, i) in filas"
          :key="f.nombre"
          class="seg"
          pathLength="100"
          cx="75"
          cy="75"
          :r="RADIO"
          transform="rotate(-90 75 75)"
          :style="{stroke: f.color, strokeWidth: 16, strokeDasharray: `${Math.max(f.pct - 1.2, 0.4)} 100`, strokeDashoffset: f.offset, animationDelay: `${0.2 + i * 0.08}s`}"
        ></circle>
      </svg>
      <div><div class="t-xs muted">Total</div><b class="t-h3 num">$ {{ compacto(total) }}</b></div>
    </div>

    <div class="col grow" style="gap: 10px; min-width: 150px">
      <div v-for="(f, i) in filas" :key="f.nombre" class="row t-sm mm-rise" :style="{'--i': i + 6}" :title="moneda(f.monto, divisa)">
        <i class="mm-dot" :style="{background: f.color}"></i><span class="grow ellipsis">{{ f.nombre }}</span><b class="num">{{ f.etiqueta }}</b>
      </div>
    </div>
  </div>
</template>
