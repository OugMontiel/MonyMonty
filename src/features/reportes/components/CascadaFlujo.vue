<script setup>
/**
 * "Del ingreso a lo que te queda": una cascada que parte de los ingresos del mes, resta cada
 * categoría de gasto (de mayor a menor) y termina en lo que quedó.
 */
import {computed} from "vue";

import {compacto, moneda} from "@/features/dashBoard/logic/formato.js";
import {escalaEje} from "../logic/calculos.js";

const props = defineProps({
  ingresos: {type: Number, required: true},
  // [{nombre, monto}] de mayor a menor
  categorias: {type: Array, required: true},
  divisa: {type: String, default: "COP"},
});

const MAX_CATEGORIAS = 6;
const IZQ = 60;
const DER = 1000;
const ARRIBA = 40;
const ABAJO = 260;

// Las categorías que no caben se agrupan en "Otros"
const pasos = computed(() => {
  const principales = props.categorias.slice(0, MAX_CATEGORIAS);
  const resto = props.categorias.slice(MAX_CATEGORIAS).reduce((s, c) => s + c.monto, 0);
  return resto > 0 ? [...principales, {nombre: "Otros", monto: resto}] : principales;
});

const gastos = computed(() => props.categorias.reduce((s, c) => s + c.monto, 0));
const resto = computed(() => props.ingresos - gastos.value);

const eje = computed(() => escalaEje(Math.max(props.ingresos, gastos.value, 1)));
const y = (v) => ABAJO - (v / eje.value.techo) * (ABAJO - ARRIBA);

const ranuras = computed(() => pasos.value.length + 2);
const ancho = computed(() => (DER - IZQ) / ranuras.value);
const grosor = 64;
const xBarra = (i) => IZQ + ancho.value * i + (ancho.value - grosor) / 2;

const barras = computed(() => {
  const lista = [{tipo: "ingreso", etiqueta: "Ingresos", valor: props.ingresos, arriba: y(props.ingresos), alto: ABAJO - y(props.ingresos), texto: compacto(props.ingresos)}];
  let tope = props.ingresos;
  for (const p of pasos.value) {
    const y0 = y(Math.max(tope, 0));
    const y1 = y(Math.max(tope - p.monto, 0));
    lista.push({tipo: "gasto", etiqueta: p.nombre.length > 11 ? `${p.nombre.slice(0, 10)}.` : p.nombre, valor: p.monto, arriba: y0, alto: Math.max(2, y1 - y0), texto: `− ${compacto(p.monto)}`, conector: y1});
    tope -= p.monto;
  }
  const queda = Math.max(tope, 0);
  lista.push({tipo: "resto", etiqueta: tope < 0 ? "Déficit" : "Te queda", valor: tope, arriba: y(queda), alto: ABAJO - y(queda), texto: `${tope < 0 ? "− " : ""}${compacto(Math.abs(tope))}`});
  return lista;
});

const resumen = computed(() => `Cascada: entran ${moneda(props.ingresos, props.divisa)}, salen ${moneda(gastos.value, props.divisa)} en ${props.categorias.length} categorías y ${resto.value >= 0 ? "quedan" : "faltan"} ${moneda(Math.abs(resto.value), props.divisa)}`);

const color = (tipo) => (tipo === "ingreso" ? "var(--income)" : tipo === "gasto" ? "var(--expense)" : "var(--brand)");
</script>

<template>
  <svg class="mm-chart" viewBox="0 0 1000 300" preserveAspectRatio="none" style="height: 300px" role="img" :aria-label="resumen">
    <g class="grid"><line v-for="v in eje.marcas.slice(1)" :key="v" :x1="IZQ" :x2="DER" :y1="y(v)" :y2="y(v)"></line></g>
    <g class="axis">
      <text v-for="v in eje.marcas.slice(1)" :key="`y${v}`" x="50" :y="y(v) + 4" text-anchor="end">{{ compacto(v) }}</text>
      <text x="50" :y="ABAJO + 4" text-anchor="end">0</text>
      <text v-for="(b, i) in barras" :key="`x${i}`" :x="xBarra(i) + grosor / 2" y="282" text-anchor="middle">{{ b.etiqueta }}</text>
    </g>

    <!-- Líneas punteadas que unen el final de una barra con el inicio de la siguiente -->
    <g style="stroke: var(--ink-subtle); stroke-width: 1; stroke-dasharray: 3 3">
      <line :x1="xBarra(0) + grosor" :x2="xBarra(1)" :y1="barras[0].arriba" :y2="barras[0].arriba"></line>
      <template v-for="(b, i) in barras" :key="`c${i}`">
        <line v-if="b.tipo === 'gasto' && i < barras.length - 1" :x1="xBarra(i) + grosor" :x2="xBarra(i + 1)" :y1="b.conector" :y2="b.conector"></line>
      </template>
    </g>

    <rect v-for="(b, i) in barras" :key="`b${i}`" class="bar" :x="xBarra(i)" :y="b.arriba" :width="grosor" :height="b.alto" :rx="b.tipo === 'gasto' ? 4 : 6" :style="{fill: color(b.tipo), animationDelay: `${0.05 + i * 0.07}s`}">
      <title>{{ b.etiqueta }}: {{ moneda(Math.abs(b.valor), divisa) }}</title>
    </rect>

    <g style="font-size: 12px; font-weight: 800; fill: var(--ink)" text-anchor="middle">
      <text v-for="(b, i) in barras" :key="`t${i}`" :x="xBarra(i) + grosor / 2" :y="b.arriba - 8" :style="b.tipo === 'resto' ? {fill: 'var(--brand-ink)'} : null">{{ b.texto }}</text>
    </g>
  </svg>
</template>
