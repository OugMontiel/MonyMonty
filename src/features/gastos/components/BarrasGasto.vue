<script setup>
/** Gasto de los últimos meses en barras, con el promedio como línea punteada; resalta el mes que se mira. */
import {computed} from "vue";

import {compacto, moneda} from "@/features/dashBoard/logic/formato.js";
import {escalaEje} from "@/features/reportes/logic/calculos.js";

const props = defineProps({
  // [{etiqueta, monto}]; la última barra es el mes que se está mirando
  meses: {type: Array, required: true},
  promedio: {type: Number, default: 0},
  divisa: {type: String, default: "COP"},
});

const IZQ = 44;
const DER = 640;
const ARRIBA = 14;
const ABAJO = 210;

const eje = computed(() => escalaEje(Math.max(1, props.promedio, ...props.meses.map((m) => m.monto))));
const y = (v) => ABAJO - (v / eje.value.techo) * (ABAJO - ARRIBA);
const ancho = computed(() => (DER - IZQ) / props.meses.length);
const grosor = computed(() => Math.min(52, ancho.value * 0.52));
const x = (i) => IZQ + ancho.value * i + (ancho.value - grosor.value) / 2;

const barras = computed(() => props.meses.map((m, i) => ({...m, x: x(i), arriba: y(m.monto), alto: Math.max(0, ABAJO - y(m.monto)), ultimo: i === props.meses.length - 1})));
const resumen = computed(() => `Gasto por mes: ${props.meses.map((m) => `${m.etiqueta} ${moneda(m.monto, props.divisa)}`).join(", ")}`);
</script>

<template>
  <svg class="mm-chart" viewBox="0 0 640 240" preserveAspectRatio="none" style="height: 240px" role="img" :aria-label="resumen">
    <g class="grid"><line v-for="v in eje.marcas.slice(1)" :key="v" :x1="IZQ" :x2="DER" :y1="y(v)" :y2="y(v)"></line></g>
    <g class="axis">
      <text v-for="v in eje.marcas.slice(1)" :key="`y${v}`" :x="IZQ - 8" :y="y(v) + 4" text-anchor="end">{{ compacto(v) }}</text>
      <text v-for="b in barras" :key="`x${b.etiqueta}${b.x}`" :x="b.x + grosor / 2" y="232" text-anchor="middle">{{ b.etiqueta }}</text>
    </g>
    <rect v-for="(b, i) in barras" :key="`b${i}`" class="bar" :x="b.x" :y="b.arriba" :width="grosor" :height="b.alto" rx="8" :style="{fill: b.ultimo ? 'var(--expense)' : 'var(--surface-3)', animationDelay: `${0.1 + i * 0.08}s`}">
      <title>{{ b.etiqueta }} · {{ moneda(b.monto, divisa) }}</title>
    </rect>
    <template v-if="promedio > 0">
      <line :x1="IZQ" :x2="DER" :y1="y(promedio)" :y2="y(promedio)" style="stroke: var(--balance); stroke-width: 1.5; stroke-dasharray: 6 4"></line>
      <text :x="DER - 4" :y="y(promedio) - 8" text-anchor="end" style="fill: var(--balance); font-size: 11px; font-weight: 700">Promedio {{ compacto(promedio) }}</text>
    </template>
    <text v-if="barras[barras.length - 1]?.monto > 0" :x="barras[barras.length - 1].x + grosor / 2" :y="barras[barras.length - 1].arriba - 8" text-anchor="middle" style="fill: var(--ink); font-size: 12px; font-weight: 800">{{ compacto(barras[barras.length - 1].monto) }}</text>
  </svg>
</template>
