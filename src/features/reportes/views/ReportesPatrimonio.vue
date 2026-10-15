<script setup>
/**
 * Reportes · Patrimonio: cuánto tienes en tus cuentas al cierre de cada mes del año
 * y cómo se reparte entre ellas.
 */
import {computed} from "vue";

import MmIcon from "@/components/mm/MmIcon.vue";
import MmTopbar from "@/components/mm/layout/MmTopbar.vue";
import {moneda, compacto, TIPOS_ENTIDAD, ENTIDAD_GENERICA} from "@/features/dashBoard/logic/formato.js";
import ReportesTabs from "../components/ReportesTabs.vue";
import {escalaEje, patrimonioPorMes, saldosPorCuenta, finDeMes, cambioPct} from "../logic/calculos.js";
import {useReportes} from "../logic/useReportes.js";

const {anio, movimientos, cuentas, divisa, cargando, error, esAnioActual, hoy, cargar} = useReportes();
const dinero = (v) => moneda(v, divisa.value);

const ultimoMes = computed(() => (esAnioActual.value ? hoy.getMonth() : 11));
const serie = computed(() => patrimonioPorMes(movimientos.value, anio.value, ultimoMes.value));
const sinDatos = computed(() => !cargando.value && !error.value && movimientos.value.length === 0);

const actual = computed(() => serie.value[serie.value.length - 1]?.valor ?? 0);
// Cierre del año anterior: punto de partida para medir cuánto creció el año
const inicio = computed(() => patrimonioPorMes(movimientos.value, anio.value - 1, 11)[11]?.valor ?? 0);
const crecimiento = computed(() => actual.value - inicio.value);
const crecimientoPct = computed(() => cambioPct(actual.value, inicio.value));

// ---------- Gráfico de línea ----------
const IZQ = 60;
const DER = 990;
const ARRIBA = 20;
const ABAJO = 220;
const eje = computed(() => escalaEje(Math.max(1, ...serie.value.map((s) => s.valor))));
const y = (v) => ABAJO - (Math.max(v, 0) / eje.value.techo) * (ABAJO - ARRIBA);
const x = (i) => IZQ + ((DER - IZQ) / Math.max(serie.value.length - 1, 1)) * i;
const puntos = computed(() => serie.value.map((s, i) => [x(i), y(s.valor)]));
const linea = computed(() => (puntos.value.length > 1 ? "M" + puntos.value.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" L") : ""));
const area = computed(() => (linea.value ? `${linea.value} L${DER},${ABAJO} L${IZQ},${ABAJO} Z` : ""));

// ---------- Reparto por cuenta al cierre del periodo ----------
const tipoDe = (c) => TIPOS_ENTIDAD[c.tipo] ?? ENTIDAD_GENERICA;
const saldos = computed(() => {
  const lista = saldosPorCuenta(movimientos.value, cuentas.value, finDeMes(anio.value, ultimoMes.value)).filter((f) => f.saldo !== 0);
  const total = lista.reduce((s, f) => s + Math.max(f.saldo, 0), 0) || 1;
  return lista.sort((a, b) => b.saldo - a.saldo).map((f) => ({...f, pct: (Math.max(f.saldo, 0) / total) * 100}));
});
</script>

<template>
  <div class="mm-page">
    <MmTopbar migas="Reportes" titulo="Patrimonio" :periodo="null" cta="" />

    <div class="mm-content" :aria-busy="cargando">
      <ReportesTabs activa="patrimonio" />

      <div v-if="error" class="mm-banner expense" role="alert">
        <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ error }}</span>
        <button type="button" class="mm-btn sm" @click="cargar"><MmIcon i="refresh" :s="16" />Reintentar</button>
      </div>

      <div v-if="cargando" class="mm-card" role="status" aria-label="Cargando el reporte"><div class="mm-skel" style="width: 100%; height: 320px"></div></div>

      <div v-else-if="sinDatos" class="mm-card">
        <div class="mm-empty">
          <h3 class="t-h3">Aún no hay movimientos</h3>
          <p class="t-sm muted">Cuando registres tus cuentas y movimientos verás cómo crece tu patrimonio.</p>
        </div>
      </div>

      <template v-else-if="!error">
        <div class="mm-card mm-rise">
          <div class="mm-card-h">
            <div>
              <div class="t-over">Patrimonio {{ esAnioActual ? "hoy" : `al cierre de ${anio}` }}</div>
              <div class="t-amt-lg" style="margin-top: 6px">{{ dinero(actual) }}</div>
            </div>
            <span class="mm-badge" :class="crecimiento >= 0 ? 'income' : 'expense'">
              {{ crecimiento >= 0 ? "+" : "−" }} {{ dinero(Math.abs(crecimiento)) }}<template v-if="crecimientoPct !== null"> · {{ Math.abs(crecimientoPct) }} %</template> en {{ anio }}
            </span>
          </div>
          <svg class="mm-chart" viewBox="0 0 1000 260" preserveAspectRatio="none" style="height: 260px" role="img" :aria-label="`Patrimonio mes a mes en ${anio}`">
            <g class="grid"><line v-for="v in eje.marcas.slice(1)" :key="v" :x1="IZQ" :x2="DER" :y1="y(v)" :y2="y(v)"></line></g>
            <g class="axis">
              <text v-for="v in eje.marcas.slice(1)" :key="`y${v}`" x="52" :y="y(v) + 4" text-anchor="end">{{ compacto(v) }}</text>
              <text v-for="(s, i) in serie" :key="`x${s.mes}`" :x="x(i)" y="244" text-anchor="middle">{{ s.etiqueta }}</text>
            </g>
            <path v-if="area" :d="area" style="fill: var(--brand); opacity: 0.1"></path>
            <path v-if="linea" class="line" pathLength="1000" :style="{'--len': 1000, stroke: 'var(--brand)'}" :d="linea"></path>
            <circle v-for="([cx, cy], i) in puntos" :key="i" class="dot" :cx="cx" :cy="cy" :r="i === puntos.length - 1 ? 5 : 3.5" style="fill: var(--surface); stroke: var(--brand); stroke-width: 3">
              <title>{{ serie[i].etiqueta }} · {{ dinero(serie[i].valor) }}</title>
            </circle>
          </svg>
        </div>

        <div class="mm-card mm-rise" style="--i: 2">
          <div class="mm-card-h"><h3 class="t-h3">Dónde está tu plata</h3><span class="t-xs muted">Saldo de cada cuenta al cierre</span></div>
          <div class="col" style="gap: 14px">
            <div v-for="f in saldos" :key="f.cuenta.id">
              <div class="row gap-2" style="margin-bottom: 6px">
                <div class="mm-ico sm cat" :style="{width: '28px', height: '28px', borderRadius: '8px', background: tipoDe(f.cuenta).color}"><MmIcon :i="tipoDe(f.cuenta).icono" :s="14" /></div>
                <b class="grow ellipsis">{{ f.cuenta.nombre }}</b>
                <b class="num t-sm" :class="{expense: f.saldo < 0}">{{ f.saldo < 0 ? "−" : "" }}{{ dinero(Math.abs(f.saldo)) }}</b>
                <span class="muted num t-xs" style="width: 40px; text-align: right">{{ Math.round(f.pct) }} %</span>
              </div>
              <div style="height: 8px; border-radius: 99px; background: var(--surface-2); overflow: hidden"><i :style="{display: 'block', height: '100%', width: `${f.pct}%`, background: tipoDe(f.cuenta).color, borderRadius: '99px'}"></i></div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.mm-page {
  display: contents;
}
</style>
