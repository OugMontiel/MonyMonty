<script setup>
/**
 * Mis gastos · Resumen del mes: cuánto se gastó frente al mes anterior y al promedio, el gasto
 * por día, el mayor gasto, el ranking por categoría y algunas lecturas automáticas.
 */
import {computed} from "vue";
import {useRouter} from "vue-router";

import MmIcon from "@/components/mm/MmIcon.vue";
import MmTopbar from "@/components/mm/layout/MmTopbar.vue";
import {moneda, iconoDe, describirMovimiento, fechaCorta, nombreMes} from "@/features/dashBoard/logic/formato.js";
import {useReportes} from "@/features/reportes/logic/useReportes.js";
import {filtros, limpiarFiltros, aInputFecha} from "@/features/movimientos/logic/filtrosMovimientos.js";
import {inicioDeMes, finDeMes} from "@/features/reportes/logic/calculos.js";
import GastosTabs from "../components/GastosTabs.vue";
import BarrasGasto from "../components/BarrasGasto.vue";
import GastosPrimerUso from "../components/GastosPrimerUso.vue";
import {resumenDeGastos, soloGastos} from "../logic/calculos.js";

const router = useRouter();
const {anio, mes, movimientos, divisa, cargando, error, etiquetaMes, nombreDelMes, esMesActual, hoy, cargar} = useReportes();
const dinero = (v) => moneda(v, divisa.value);

const r = computed(() => resumenDeGastos(movimientos.value, anio.value, mes.value, hoy));
// Sin ningún gasto en todo el historial se muestra la bienvenida; con historial pero un mes vacío, un aviso corto
const primerUso = computed(() => !cargando.value && !error.value && soloGastos(movimientos.value).length === 0);
const sinGastos = computed(() => !cargando.value && !error.value && r.value.movimientos.length === 0);
const mesAnterior = computed(() => nombreMes(r.value.mesAnterior));

const mayor = computed(() => (r.value.mayor ? {titulo: describirMovimiento(r.value.mayor).titulo, fecha: fechaCorta(r.value.mayor.fecha)} : null));
const cambio = computed(() => {
  const p = r.value.cambioPct;
  if (p === null) return null;
  // Gastar menos es la buena noticia: la flecha apunta al sentido del cambio y el color (verde = "up") al juicio
  return {texto: `${Math.abs(p).toLocaleString("es-CO", {maximumFractionDigits: 1})} %`, sube: p > 0, tono: p > 0 ? "down" : "up"};
});
const maxCategoria = computed(() => Math.max(1, ...r.value.categorias.map((c) => c.monto)));

/** Abre Movimientos con los gastos de este mes ya filtrados */
function verMovimientos() {
  limpiarFiltros();
  filtros.tipo = "EGRESO";
  filtros.preset = "personalizado";
  filtros.desde = aInputFecha(inicioDeMes(anio.value, mes.value));
  filtros.hasta = aInputFecha(finDeMes(anio.value, mes.value));
  router.push("/movimientos");
}
</script>

<template>
  <div class="mm-page">
    <MmTopbar :migas="`Mi dinero · ${nombreDelMes}`" titulo="Mis gastos" :periodo="null" cta="Registrar gasto" />

    <div class="mm-content" :aria-busy="cargando">
      <GastosTabs activa="resumen" />

      <div v-if="error" class="mm-banner expense" role="alert">
        <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ error }}</span>
        <button type="button" class="mm-btn sm" @click="cargar"><MmIcon i="refresh" :s="16" />Reintentar</button>
      </div>

      <div v-if="cargando" class="mm-card" role="status" aria-label="Cargando tus gastos"><div class="mm-skel" style="width: 100%; height: 340px"></div></div>

      <GastosPrimerUso v-else-if="primerUso" />

      <div v-else-if="sinGastos" class="mm-card">
        <div class="mm-empty">
          <h3 class="t-h3">Sin gastos en {{ etiquetaMes }}</h3>
          <p class="t-sm muted">Elige otro mes con las flechas o registra un gasto con el botón de arriba.</p>
        </div>
      </div>

      <template v-else-if="!error">
        <div class="grid g4">
          <div class="mm-card mm-kpi mm-rise" style="--i: 0">
            <div class="blob" style="background: var(--expense)"></div>
            <div class="t-over">Gastaste</div>
            <div class="t-amt-lg" style="margin-top: 10px">{{ dinero(r.total) }}</div>
            <div class="row" style="margin-top: 8px">
              <template v-if="cambio">
                <span class="mm-delta" :class="cambio.tono"><MmIcon :i="cambio.sube ? 'arrow-up' : 'arrow-down'" :s="11" />{{ cambio.texto }}</span>
                <span class="t-xs muted" :title="esMesActual ? `Comparado con los mismos días de ${mesAnterior}` : undefined">vs. {{ mesAnterior }}</span>
              </template>
              <span v-else class="t-xs muted">Sin gastos en {{ mesAnterior }} para comparar</span>
            </div>
          </div>
          <div class="mm-card mm-kpi mm-rise" style="--i: 1">
            <div class="blob" style="background: var(--balance)"></div>
            <div class="t-over">Promedio mensual</div>
            <div class="t-amt-lg" style="margin-top: 10px">{{ dinero(r.promedioMensual) }}</div>
            <div class="t-xs muted" style="margin-top: 10px">Últimos 6 meses</div>
          </div>
          <div class="mm-card mm-kpi mm-rise" style="--i: 2">
            <div class="blob" style="background: var(--warning)"></div>
            <div class="t-over">Gasto diario</div>
            <div class="t-amt-lg" style="margin-top: 10px">{{ dinero(r.gastoDiario) }}</div>
            <div class="t-xs muted" style="margin-top: 10px">Promedio en {{ r.dias }} {{ r.dias === 1 ? "día" : "días" }}</div>
          </div>
          <div class="mm-card mm-kpi mm-rise" style="--i: 3">
            <div class="blob" style="background: var(--cat-indigo)"></div>
            <div class="t-over">Mayor gasto</div>
            <div class="t-amt-lg" style="margin-top: 10px">{{ dinero(r.mayor.monto) }}</div>
            <div class="t-xs muted ellipsis" style="margin-top: 10px">{{ mayor.titulo }} · {{ mayor.fecha }}</div>
          </div>
        </div>

        <div class="grid g-main">
          <div class="mm-card mm-rise" style="--i: 4">
            <div class="mm-card-h">
              <div><h3 class="t-h3">Gasto por mes</h3><div class="t-xs muted">Últimos 6 meses{{ esMesActual ? " · el mes actual va en curso" : "" }}</div></div>
              <span class="mm-badge"><i class="mm-dot" style="background: var(--expense)"></i>{{ nombreDelMes }}</span>
            </div>
            <BarrasGasto :meses="r.serie" :promedio="r.promedioMensual" :divisa="divisa" />
          </div>

          <div class="mm-card mm-rise" style="--i: 5">
            <div class="mm-card-h"><h3 class="t-h3">Ranking por categoría</h3><button type="button" class="enlace t-sm" @click="verMovimientos">Ver movimientos</button></div>
            <div class="col" style="gap: 14px">
              <div v-for="(c, i) in r.categorias.slice(0, 6)" :key="c.id" class="col gap-1">
                <div class="row t-sm">
                  <div class="mm-ico cat sm" :style="{width: '28px', height: '28px', borderRadius: '8px', background: c.color}"><MmIcon :i="iconoDe(c.icono)" :s="14" /></div>
                  <span class="grow ellipsis">{{ c.nombre }}</span>
                  <b class="num">{{ dinero(c.monto) }}</b>
                  <span class="muted num" style="width: 42px; text-align: right">{{ Math.round(c.pct) }} %</span>
                </div>
                <div class="mm-progress sm"><i :style="{'--w': `${(c.monto / maxCategoria) * 100}%`, '--c': c.color, '--i': i}"></i></div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="r.lecturas.length" class="grid g3">
          <div v-for="(l, i) in r.lecturas" :key="l.titulo" class="mm-card mm-rise" :style="{'--i': 6 + i}">
            <div class="row gap-3">
              <div class="mm-ico" :class="l.tono"><MmIcon :i="l.icono" :s="22" /></div>
              <div class="grow"><div class="t-label">{{ l.titulo }}</div><div class="t-sm muted">{{ l.texto }}</div></div>
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
.enlace {
  border: 0;
  background: none;
  padding: 0;
  color: var(--brand-ink);
  font-weight: 700;
  cursor: pointer;
}
.enlace:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
