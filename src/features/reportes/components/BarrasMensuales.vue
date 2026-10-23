<script setup>
/** Ingresos y gastos por mes como barras dobles, con la tasa de ahorro como línea por encima. */
import {computed} from "vue";

import {compacto, moneda} from "@/features/dashBoard/logic/formato.js";
import {escalaEje} from "../logic/calculos.js";

const props = defineProps({
  // [{mes, etiqueta, ingresos, gastos, tasa}]
  meses: {type: Array, required: true},
  divisa: {type: String, default: "COP"},
});

// Zona de dibujo dentro del viewBox 1000×260
const IZQ = 40;
const DER = 1000;
const ARRIBA = 10;
const ABAJO = 220;

const eje = computed(() => escalaEje(Math.max(1, ...props.meses.flatMap((m) => [m.ingresos, m.gastos]))));
const ancho = computed(() => (DER - IZQ) / props.meses.length);
const y = (v) => ABAJO - (v / eje.value.techo) * (ABAJO - ARRIBA);
const centro = (i) => IZQ + ancho.value * (i + 0.5);
const grosor = computed(() => Math.max(6, Math.min(22, ancho.value * 0.24)));

const barras = computed(() =>
  props.meses.map((m, i) => ({
    ...m,
    x: centro(i),
    yIngreso: y(m.ingresos),
    yGasto: y(m.gastos),
  }))
);

// Línea de tasa de ahorro (0–100 % sobre la altura del gráfico); los meses sin ingresos se saltan
const linea = computed(() => {
  const pts = barras.value.filter((b) => b.tasa !== null).map((b) => [b.x, ABAJO - (Math.max(0, Math.min(100, b.tasa)) / 100) * (ABAJO - ARRIBA)]);
  return pts.length > 1 ? "M" + pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" L") : "";
});
const ultimo = computed(() => [...barras.value].reverse().find((b) => b.tasa !== null));
const puntoUltimo = computed(() => (ultimo.value ? [ultimo.value.x, ABAJO - (Math.max(0, Math.min(100, ultimo.value.tasa)) / 100) * (ABAJO - ARRIBA)] : null));

const resumen = computed(() => `Ingresos y gastos por mes. ${props.meses.map((m) => `${m.etiqueta}: ingresos ${moneda(m.ingresos, props.divisa)}, gastos ${moneda(m.gastos, props.divisa)}`).join("; ")}`);
</script>

<template>
  <svg class="mm-chart" viewBox="0 0 1000 260" preserveAspectRatio="none" style="height: 260px" role="img" :aria-label="resumen">
    <g class="grid"><line v-for="v in eje.marcas.slice(1)" :key="v" :x1="IZQ" :x2="DER" :y1="y(v)" :y2="y(v)"></line></g>
    <g class="axis">
      <text v-for="v in eje.marcas.slice(1)" :key="`y${v}`" x="32" :y="y(v) + 4" text-anchor="end">{{ compacto(v) }}</text>
      <text v-for="b in barras" :key="`x${b.mes}`" :x="b.x" y="240" text-anchor="middle">{{ b.etiqueta }}</text>
    </g>
    <template v-for="(b, i) in barras" :key="b.mes">
      <rect class="bar" :x="b.x - grosor - 2" :y="b.yIngreso" :width="grosor" :height="Math.max(0, ABAJO - b.yIngreso)" rx="4" :style="{fill: 'var(--income)', animationDelay: `${0.05 + i * 0.05}s`}"><title>{{ b.etiqueta }} · ingresos {{ moneda(b.ingresos, divisa) }}</title></rect>
      <rect class="bar" :x="b.x + 2" :y="b.yGasto" :width="grosor" :height="Math.max(0, ABAJO - b.yGasto)" rx="4" :style="{fill: 'var(--expense)', animationDelay: `${0.08 + i * 0.05}s`}"><title>{{ b.etiqueta }} · gastos {{ moneda(b.gastos, divisa) }}</title></rect>
    </template>
    <path v-if="linea" class="line" pathLength="1000" :style="{'--len': 1000, stroke: 'var(--brand)', animationDelay: '0.7s'}" :d="linea"></path>
    <circle v-if="puntoUltimo" class="dot" :cx="puntoUltimo[0]" :cy="puntoUltimo[1]" r="5" style="fill: var(--surface); stroke: var(--brand); stroke-width: 3"></circle>
  </svg>
</template>
