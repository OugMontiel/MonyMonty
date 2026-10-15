<script setup>
/**
 * Reportes · Resumen del año: ingresos contra gastos mes a mes con la tasa de ahorro,
 * y una tabla con el cierre de cada mes.
 */
import {computed} from "vue";

import MmIcon from "@/components/mm/MmIcon.vue";
import MmTopbar from "@/components/mm/layout/MmTopbar.vue";
import {moneda, porcentaje} from "@/features/dashBoard/logic/formato.js";
import ReportesTabs from "../components/ReportesTabs.vue";
import BarrasMensuales from "../components/BarrasMensuales.vue";
import {delAnio, mesesDelAnio, totales} from "../logic/calculos.js";
import {useReportes} from "../logic/useReportes.js";

const {anio, movimientos, divisa, cargando, error, esAnioActual, hoy, cargar, exportarAbierto, mesDetalle} = useReportes();
const abrirDetalle = (m) => (mesDetalle.value = {anio: anio.value, mes: m.mes});
const dinero = (v) => moneda(v, divisa.value);

// Hasta el mes actual si es el año en curso; todos los meses en años pasados
const ultimoMes = computed(() => (esAnioActual.value ? hoy.getMonth() : 11));
const meses = computed(() => mesesDelAnio(movimientos.value, anio.value, ultimoMes.value));
const conActividad = computed(() => meses.value.filter((m) => m.cantidad > 0));
// El gráfico arranca en el primer mes con movimientos (sin meses vacíos al principio)
const mesesGrafico = computed(() => (conActividad.value.length ? meses.value.slice(conActividad.value[0].mes) : meses.value));
const totalAnio = computed(() => totales(delAnio(movimientos.value, anio.value)));
const sinDatos = computed(() => !cargando.value && !error.value && conActividad.value.length === 0);

// Se muestran los meses con movimientos, el más reciente primero
const filas = computed(() => [...conActividad.value].reverse());
const esEnCurso = (m) => esAnioActual.value && m.mes === hoy.getMonth();

const tonoTasa = (t) => (t === null ? "" : t >= 30 ? "income" : t >= 15 ? "" : "warn");

/** Mes con mejor tasa de ahorro, y qué pasó respecto al resto del año */
const mejorMes = computed(() => {
  const candidatos = conActividad.value.filter((m) => m.tasa !== null);
  if (!candidatos.length) return null;
  const mejor = [...candidatos].sort((a, b) => b.tasa - a.tasa)[0];
  const otros = candidatos.filter((m) => m.mes !== mejor.mes);
  const promedioGasto = otros.length ? otros.reduce((s, m) => s + m.gastos, 0) / otros.length : null;
  let detalle = `Ahorraste ${dinero(mejor.ahorro)} de ${dinero(mejor.ingresos)} que entraron.`;
  if (promedioGasto && mejor.gastos < promedioGasto) detalle += ` Gastaste ${dinero(promedioGasto - mejor.gastos)} menos que el promedio de tus otros meses.`;
  return {...mejor, detalle};
});
</script>

<template>
  <div class="mm-page">
    <MmTopbar migas="Resumen" titulo="Reportes" :periodo="null" cta="Exportar" cta-icono="download" cta-personalizado @cta="exportarAbierto = true" />

    <div class="mm-content" :aria-busy="cargando">
      <ReportesTabs activa="resumen" />

      <div v-if="error" class="mm-banner expense" role="alert">
        <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ error }}</span>
        <button type="button" class="mm-btn sm" @click="cargar"><MmIcon i="refresh" :s="16" />Reintentar</button>
      </div>

      <div v-if="cargando" class="mm-card" role="status" aria-label="Cargando el reporte">
        <div class="mm-skel" style="width: 220px; height: 16px; margin-bottom: 18px"></div>
        <div class="mm-skel" style="width: 100%; height: 240px"></div>
      </div>

      <div v-else-if="sinDatos" class="mm-card">
        <div class="mm-empty">
          <div class="art"><div class="mm-ico lg brand mm-float" style="width: 56px; height: 56px; border-radius: 18px"><MmIcon i="stats-chart" :s="26" /></div></div>
          <h3 class="t-h3">Sin movimientos en {{ anio }}</h3>
          <p class="t-sm muted" style="max-width: 340px">Cuando registres ingresos y gastos, aquí verás cómo se mueve tu dinero mes a mes.</p>
        </div>
      </div>

      <template v-else-if="!error">
        <div class="mm-card mm-rise">
          <div class="mm-card-h">
            <div><h3 class="t-h3">Ingresos vs. gastos por mes</h3><div class="t-xs muted">{{ mesesGrafico[0].nombre }} – {{ mesesGrafico[mesesGrafico.length - 1].nombre }} {{ anio }}</div></div>
            <div class="mm-legend">
              <span><i class="mm-dot" style="background: var(--income)"></i>Ingresos</span>
              <span><i class="mm-dot" style="background: var(--expense)"></i>Gastos</span>
              <span><i class="mm-dot" style="background: var(--brand)"></i>Tasa de ahorro</span>
            </div>
          </div>
          <BarrasMensuales :meses="mesesGrafico" :divisa="divisa" />
        </div>

        <div class="grid g-main">
          <div class="mm-card pad0 mm-rise" style="--i: 2">
            <div class="mm-card-h" style="padding: 20px 20px 0"><h3 class="t-h3">Resumen del año</h3><span class="t-xs muted">Sin contar transferencias entre tus cuentas</span></div>
            <div style="overflow-x: auto">
              <table class="mm-table">
                <thead><tr><th>Mes</th><th class="r">Ingresos</th><th class="r">Gastos</th><th class="r">Ahorro</th><th class="r">Tasa</th></tr></thead>
                <tbody>
                  <tr v-for="m in filas" :key="m.mes" class="fila-mes" tabindex="0" :aria-label="`Ver detalle de ${m.nombre}`" @click="abrirDetalle(m)" @keydown.enter="abrirDetalle(m)">
                    <td><b>{{ m.nombre }}</b> <span v-if="esEnCurso(m)" class="mm-badge brand">en curso</span></td>
                    <td class="r t-amt income">+ {{ dinero(m.ingresos) }}</td>
                    <td class="r t-amt">− {{ dinero(m.gastos) }}</td>
                    <td class="r t-amt" :class="{expense: m.ahorro < 0}">{{ m.ahorro < 0 ? "− " : "" }}{{ dinero(Math.abs(m.ahorro)) }}</td>
                    <td class="r"><span v-if="m.tasa !== null" class="mm-badge" :class="tonoTasa(m.tasa)">{{ m.tasa }} %</span><span v-else class="muted">—</span></td>
                  </tr>
                  <tr style="background: var(--surface-2)">
                    <td><b>Total {{ anio }}</b></td>
                    <td class="r t-amt income">+ {{ dinero(totalAnio.ingresos) }}</td>
                    <td class="r t-amt">− {{ dinero(totalAnio.gastos) }}</td>
                    <td class="r t-amt"><b :class="{expense: totalAnio.ahorro < 0}">{{ totalAnio.ahorro < 0 ? "− " : "" }}{{ dinero(Math.abs(totalAnio.ahorro)) }}</b></td>
                    <td class="r"><span v-if="totalAnio.tasa !== null" class="mm-badge" :class="tonoTasa(totalAnio.tasa)">{{ totalAnio.tasa }} %</span><span v-else class="muted">—</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="col gap-6">
            <div v-if="mejorMes" class="mm-card mm-rise" style="--i: 3">
              <div class="t-over">Tu mejor mes</div>
              <div class="t-h2" style="margin-top: 6px">{{ mejorMes.nombre }} · {{ porcentaje(mejorMes.tasa, 0) }} ahorrado</div>
              <p class="t-sm muted" style="margin-top: 4px">{{ mejorMes.detalle }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.fila-mes {
  cursor: pointer;
}
.fila-mes:hover {
  background: var(--surface-2);
}
.mm-page {
  display: contents;
}
</style>
