<script setup>
/**
 * Reportes · Comparar periodos: el mes que estás viendo contra otro mes a elección
 * (por defecto el anterior), con el cambio en ingresos, gastos, ahorro y por categoría.
 */
import {ref, computed, watch} from "vue";

import MmIcon from "@/components/mm/MmIcon.vue";
import MmTopbar from "@/components/mm/layout/MmTopbar.vue";
import {moneda} from "@/features/dashBoard/logic/formato.js";
import ReportesTabs from "../components/ReportesTabs.vue";
import {delMes, esFlujo, totales, gastoPorCategoria, cambioPct} from "../logic/calculos.js";
import {useReportes} from "../logic/useReportes.js";

const {anio, mes, movimientos, divisa, cargando, error, etiquetaMes, cargar} = useReportes();
const dinero = (v) => moneda(v, divisa.value);

const NOMBRES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const etiqueta = (f) => `${NOMBRES[f.getMonth()][0].toUpperCase()}${NOMBRES[f.getMonth()].slice(1)} ${f.getFullYear()}`;

// Meses candidatos a comparar: los 12 anteriores al que se mira
const opciones = computed(() =>
  Array.from({length: 12}, (_, i) => {
    const f = new Date(anio.value, mes.value - 1 - i, 1);
    return {valor: `${f.getFullYear()}-${f.getMonth()}`, anio: f.getFullYear(), mes: f.getMonth(), texto: etiqueta(f)};
  })
);
const elegido = ref("");
// Si cambia el mes visto, el de referencia vuelve a ser el anterior
watch(opciones, (o) => { if (!o.some((x) => x.valor === elegido.value)) elegido.value = o[0].valor; }, {immediate: true});
const base = computed(() => opciones.value.find((o) => o.valor === elegido.value) ?? opciones.value[0]);

const movsA = computed(() => delMes(movimientos.value, anio.value, mes.value));
const movsB = computed(() => delMes(movimientos.value, base.value.anio, base.value.mes));
const a = computed(() => totales(movsA.value));
const b = computed(() => totales(movsB.value));
const sinDatos = computed(() => !cargando.value && !error.value && ![...movsA.value, ...movsB.value].some(esFlujo));

const kpis = computed(() => [
  {titulo: "Ingresos", ahora: a.value.ingresos, antes: b.value.ingresos, bueno: "sube"},
  {titulo: "Gastos", ahora: a.value.gastos, antes: b.value.gastos, bueno: "baja"},
  {titulo: "Ahorro", ahora: a.value.ahorro, antes: b.value.ahorro, bueno: "sube"},
]);
const variacion = (k) => {
  const d = k.ahora - k.antes;
  if (d === 0) return {texto: "Sin cambio", tono: ""};
  const p = cambioPct(k.ahora, k.antes);
  const mejora = (d > 0) === (k.bueno === "sube");
  return {texto: `${d > 0 ? "▲" : "▼"} ${dinero(Math.abs(d))}${p === null || Math.abs(p) > 300 ? "" : ` · ${Math.abs(p)} %`}`, tono: mejora ? "income" : "expense"};
};

// Categorías de gasto de ambos meses, ordenadas por el cambio absoluto
const filas = computed(() => {
  const mapa = new Map();
  for (const c of gastoPorCategoria(movsA.value)) mapa.set(c.id, {...c, ahora: c.monto, antes: 0});
  for (const c of gastoPorCategoria(movsB.value)) {
    const f = mapa.get(c.id) ?? {...c, ahora: 0};
    f.antes = c.monto;
    mapa.set(c.id, f);
  }
  return [...mapa.values()].map((f) => ({...f, delta: f.ahora - f.antes})).sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));
});
const maxFila = computed(() => Math.max(1, ...filas.value.flatMap((f) => [f.ahora, f.antes])));
</script>

<template>
  <div class="mm-page">
    <MmTopbar migas="Reportes" titulo="Comparar periodos" :periodo="null" cta="" />

    <div class="mm-content" :aria-busy="cargando">
      <ReportesTabs activa="comparar" />

      <div v-if="error" class="mm-banner expense" role="alert">
        <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ error }}</span>
        <button type="button" class="mm-btn sm" @click="cargar"><MmIcon i="refresh" :s="16" />Reintentar</button>
      </div>

      <div v-if="cargando" class="mm-card" role="status" aria-label="Cargando el reporte"><div class="mm-skel" style="width: 100%; height: 320px"></div></div>

      <template v-else-if="!error">
        <div class="row gap-3" style="flex-wrap: wrap">
          <span class="t-label">{{ etiquetaMes }}</span>
          <span class="muted t-sm">contra</span>
          <select v-model="elegido" class="mm-select" aria-label="Mes de referencia">
            <option v-for="o in opciones" :key="o.valor" :value="o.valor">{{ o.texto }}</option>
          </select>
        </div>

        <div v-if="sinDatos" class="mm-card">
          <div class="mm-empty">
            <h3 class="t-h3">Sin movimientos para comparar</h3>
            <p class="t-sm muted">Ninguno de los dos meses tiene ingresos ni gastos registrados.</p>
          </div>
        </div>

        <template v-else>
          <div class="grid g3">
            <div v-for="(k, i) in kpis" :key="k.titulo" class="mm-card mm-kpi mm-rise" :style="{'--i': i}">
              <div class="t-over">{{ k.titulo }}</div>
              <div class="t-amt-lg" style="margin-top: 10px">{{ k.ahora < 0 ? "−" : "" }}{{ dinero(Math.abs(k.ahora)) }}</div>
              <div class="t-xs muted" style="margin-top: 6px">{{ base.texto }}: {{ k.antes < 0 ? "−" : "" }}{{ dinero(Math.abs(k.antes)) }}</div>
              <div class="row" style="margin-top: 8px"><span class="mm-badge" :class="variacion(k).tono">{{ variacion(k).texto }}</span></div>
            </div>
          </div>

          <div class="mm-card mm-rise" style="--i: 3">
            <div class="mm-card-h">
              <h3 class="t-h3">Gasto por categoría</h3>
              <div class="mm-legend">
                <span><i class="mm-dot" style="background: var(--brand)"></i>{{ etiquetaMes }}</span>
                <span><i class="mm-dot" style="background: var(--surface-3)"></i>{{ base.texto }}</span>
              </div>
            </div>
            <p v-if="!filas.length" class="t-sm muted">Ningún gasto en estos meses.</p>
            <div class="col" style="gap: 16px">
              <div v-for="f in filas" :key="f.id">
                <div class="row gap-2" style="margin-bottom: 6px">
                  <b class="grow ellipsis">{{ f.nombre }}</b>
                  <span class="mm-badge" :class="f.delta === 0 ? '' : f.delta > 0 ? 'expense' : 'income'">{{ f.delta === 0 ? "Igual" : `${f.delta > 0 ? "▲" : "▼"} ${dinero(Math.abs(f.delta))}` }}</span>
                </div>
                <div class="barra"><i :style="{width: `${(f.ahora / maxFila) * 80}%`, background: f.color}"></i><span class="num t-xs">{{ dinero(f.ahora) }}</span></div>
                <div class="barra previa"><i :style="{width: `${(f.antes / maxFila) * 80}%`}"></i><span class="num t-xs muted">{{ dinero(f.antes) }}</span></div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.mm-page {
  display: contents;
}
.barra {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 14px;
  margin-bottom: 4px;
}
.barra span {
  white-space: nowrap;
}
.barra i {
  display: block;
  height: 100%;
  min-width: 3px;
  border-radius: 99px;
  transition: width var(--dur-slow) var(--ease-spring);
}
.barra.previa i {
  background: var(--surface-3);
}
.mm-select {
  font: inherit;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
}
</style>
