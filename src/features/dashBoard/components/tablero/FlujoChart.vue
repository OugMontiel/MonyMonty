<script setup>
/** Flujo de dinero (S17): ingresos y gastos de los últimos meses como dos curvas suaves. */
import {computed, useId} from "vue";

import {compacto} from "../../logic/formato.js";

const props = defineProps({
  // [{etiqueta, ingresos, gastos}] de más antiguo a más reciente
  serie: {type: Array, required: true},
});

// Área de dibujo dentro del viewBox 640×230 (el eje Y queda a la izquierda)
const IZQ = 44;
const DER = 632;
const ARRIBA = 10;
const ABAJO = 204;
const uid = useId().replace(/:/g, "");

const tieneDatos = computed(() => props.serie.some((p) => p.ingresos > 0 || p.gastos > 0));

/** Techo "redondo" para el eje: 1, 2, 5 o 10 por la potencia de diez que corresponda */
const techo = computed(() => {
  const m = Math.max(1, ...props.serie.flatMap((p) => [p.ingresos, p.gastos]));
  const mag = 10 ** Math.floor(Math.log10(m));
  const norm = m / mag;
  return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
});

const x = (i) => IZQ + (i * (DER - IZQ)) / Math.max(1, props.serie.length - 1);
const y = (v) => ABAJO - (v / techo.value) * (ABAJO - ARRIBA);
const r1 = (n) => Math.round(n * 10) / 10;

/** Curva con tangentes horizontales en cada punto, igual que en el diseño */
function curva(valores) {
  const pts = valores.map((v, i) => [x(i), y(v)]);
  let d = `M${r1(pts[0][0])},${r1(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C${r1(cx)},${r1(y0)} ${r1(cx)},${r1(y1)} ${r1(x1)},${r1(y1)}`;
  }
  return d;
}

const lineaIngresos = computed(() => curva(props.serie.map((p) => p.ingresos)));
const lineaGastos = computed(() => curva(props.serie.map((p) => p.gastos)));
const area = (linea) => `${linea} L${DER},${ABAJO} L${IZQ},${ABAJO} Z`;

const ultimo = computed(() => props.serie.length - 1);
const ejeY = computed(() =>
  [0, 1, 2, 3, 4].map((i) => {
    const valor = (techo.value * i) / 4;
    return {valor, y: ABAJO - (i * (ABAJO - ARRIBA)) / 4, texto: valor === 0 ? "0" : compacto(valor)};
  })
);
</script>

<template>
  <div v-if="!tieneDatos" class="mm-empty" style="padding: 40px 16px">
    <h4 class="t-h3">Todavía no hay datos de estos meses</h4>
    <p class="t-sm muted">Cuando registres ingresos y gastos, aquí verás cómo se mueve tu dinero.</p>
  </div>

  <svg v-else class="mm-chart" viewBox="0 0 640 230" preserveAspectRatio="none" style="height: 230px" role="img" aria-label="Ingresos y gastos de los últimos meses">
    <defs>
      <linearGradient :id="`${uid}gi`" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color: var(--income); stop-opacity: 0.22"></stop><stop offset="1" style="stop-color: var(--income); stop-opacity: 0"></stop></linearGradient>
      <linearGradient :id="`${uid}ge`" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color: var(--expense); stop-opacity: 0.22"></stop><stop offset="1" style="stop-color: var(--expense); stop-opacity: 0"></stop></linearGradient>
    </defs>
    <g class="grid"><line v-for="t in ejeY" :key="t.valor" :x1="IZQ" :x2="DER" :y1="t.y" :y2="t.y"></line></g>
    <g class="axis">
      <text v-for="t in ejeY" :key="`y${t.valor}`" x="34" :y="t.y + 4" text-anchor="end">{{ t.texto }}</text>
      <text v-for="(p, i) in serie" :key="p.etiqueta + i" :x="x(i)" y="224" text-anchor="middle">{{ p.etiqueta }}</text>
    </g>

    <path class="area" :fill="`url(#${uid}gi)`" :d="area(lineaIngresos)"></path>
    <path class="line" pathLength="1000" style="--len: 1000; stroke: var(--income)" :d="lineaIngresos"></path>
    <circle class="dot" :cx="x(ultimo)" :cy="y(serie[ultimo].ingresos)" r="5" style="fill: var(--surface); stroke: var(--income); stroke-width: 3"></circle>

    <path class="area" :fill="`url(#${uid}ge)`" :d="area(lineaGastos)"></path>
    <path class="line" pathLength="1000" style="--len: 1000; stroke: var(--expense); animation-delay: 0.45s" :d="lineaGastos"></path>
    <circle class="dot" :cx="x(ultimo)" :cy="y(serie[ultimo].gastos)" r="5" style="fill: var(--surface); stroke: var(--expense); stroke-width: 3"></circle>
  </svg>
</template>
