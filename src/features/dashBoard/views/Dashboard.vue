<script setup>
/**
 * ============================================================
 * Autor: Diego Alejandro Montiel Flórez
 * Proyecto: MonyMonty
 * Descripción: Este código es propiedad intelectual de
 * Diego Alejandro Montiel Flórez. Su uso, copia o distribución
 * sin autorización está estrictamente prohibido.
 * ============================================================
 *
 * Mi estado actual (S17), con su estado de carga (S18), de primer uso (S19) y su versión móvil (S24).
 */
import {computed, onMounted, watch} from "vue";

import {useGlobalState} from "@/composables/useGlobalState";
import {useUsuario} from "@/composables/useUsuario.js";
import {useAppUi} from "@/composables/useAppUi.js";
import {useTablero} from "../logic/useTablero.js";
import {moneda, compacto, porcentaje, describirMovimiento, fechaCorta, iconoDe, montoConSigno} from "../logic/formato.js";
import MmIcon from "@/components/mm/MmIcon.vue";
import MmTopbar from "@/components/mm/layout/MmTopbar.vue";
import TableroSkeleton from "../components/tablero/TableroSkeleton.vue";
import TableroVacio from "../components/tablero/TableroVacio.vue";
import FlujoChart from "../components/tablero/FlujoChart.vue";
import DonutCategorias from "../components/tablero/DonutCategorias.vue";
import MovimientosRecientes from "../components/tablero/MovimientosRecientes.vue";
import CuentasLista from "../components/tablero/CuentasLista.vue";

const {periodo, cargando, error, kpis, flujo, ranking, recientes, divisaPrincipal, sinMovimientos, totalGastoPeriodo, etiquetas, cargar} = useTablero();
const {globalDataRefreshTrigger} = useGlobalState();
const {primerNombre} = useUsuario();
const {abrirMovimiento} = useAppUi();

const dinero = (v) => moneda(v, divisaPrincipal.value);

onMounted(() => cargar());
// Cambiar de periodo solo recalcula lo que depende de él; crear o editar datos descarta la caché
watch(periodo, () => cargar());
watch(globalDataRefreshTrigger, () => cargar({refrescar: true}));

/** Flecha, color y texto de una variación. En gastos, bajar es lo bueno. */
function delta(v, {inverso = false} = {}) {
  if (v === null || v === undefined || Math.abs(v) < 0.05) return null;
  const sube = v > 0;
  return {clase: (inverso ? !sube : sube) ? "up" : "down", flecha: sube ? "arrow-up" : "arrow-down", texto: porcentaje(Math.abs(v)), sube};
}

const dDisponible = computed(() => delta(kpis.value.disponible.variacion));
const dIngresos = computed(() => delta(kpis.value.ingresos.variacion));
const dGastos = computed(() => delta(kpis.value.gastos.variacion, {inverso: true}));

const indiceDonut = computed(() => (kpis.value.ahorro === null ? 0 : kpis.value.ahorro));

// Línea del saldo en la tarjeta móvil: resultado neto (ingresos − gastos) de cada mes
const chispa = computed(() => {
  const w = 320;
  const h = 60;
  const neto = flujo.value.map((p) => p.ingresos - p.gastos);
  if (neto.length < 2) return "";
  const min = Math.min(...neto);
  const max = Math.max(...neto);
  const rango = max - min || 1;
  const pts = neto.map((v, i) => [(i * w) / (neto.length - 1), h - 8 - ((v - min) / rango) * (h - 16)]);
  return pts.reduce((d, [x, y], i) => {
    if (!i) return `M${x},${y.toFixed(1)}`;
    const cx = (pts[i - 1][0] + x) / 2;
    return `${d} C${cx},${pts[i - 1][1].toFixed(1)} ${cx},${y.toFixed(1)} ${x},${y.toFixed(1)}`;
  }, "");
});

const topCategorias = computed(() => ranking.value.slice(0, 3));
const colorMovil = (m) => (m.tipo === "TRANSFERENCIA" ? "var(--cat-sky)" : m.categoria?.color || "var(--cat-slate)");
const iconoMovil = (m) => (m.tipo === "TRANSFERENCIA" ? "swap-horizontal" : iconoDe(m.categoria?.icono));
const indicePeriodo = computed(() => ["semana", "mes", "anio"].indexOf(periodo.value));
</script>

<template>
  <div class="mm-page">
    <MmTopbar :migas="etiquetas.migas" titulo="Mi estado actual" :periodo="sinMovimientos ? null : periodo" @update:periodo="periodo = $event" />

    <div class="mm-content" :aria-busy="cargando">
      <TableroSkeleton v-if="cargando" />

      <template v-else>
        <div v-if="error" class="mm-banner expense" role="alert">
          <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ error }}</span>
          <button type="button" class="mm-btn sm" @click="cargar({refrescar: true})"><MmIcon i="refresh" :s="16" />Reintentar</button>
        </div>

        <TableroVacio v-if="sinMovimientos" :nombre="primerNombre" />

        <template v-else-if="!error">
          <!-- Selector de periodo móvil (el de escritorio vive en la barra superior) -->
          <div class="mm-seg mm-only-mobile" role="group" aria-label="Periodo" :style="{'--n': 3, '--on': indicePeriodo, width: '100%'}">
            <i class="thumb"></i>
            <button v-for="p in [['semana', 'Semana'], ['mes', 'Mes'], ['anio', 'Año']]" :key="p[0]" type="button" :class="{'is-on': periodo === p[0]}" @click="periodo = p[0]">{{ p[1] }}</button>
          </div>

          <!-- Móvil: tarjeta principal con el saldo -->
          <section class="mm-hero mm-rise mm-only-mobile" style="padding: 22px">
            <div class="orb mm-float" style="width: 180px; height: 180px; right: -50px; top: -70px; background: var(--brand); opacity: 0.45"></div>
            <div style="position: relative">
              <div class="t-over" style="color: color-mix(in srgb, var(--bg) 70%, transparent)">Disponible</div>
              <div class="t-amt-xl" style="margin-top: 6px">{{ dinero(kpis.disponible.valor) }}</div>
              <div class="row" style="margin-top: 8px">
                <template v-if="dDisponible">
                  <span class="mm-delta" :class="dDisponible.clase"><MmIcon :i="dDisponible.flecha" :s="11" />{{ dDisponible.texto }}</span>
                  <span class="t-xs muted">vs. {{ etiquetas.previo }}</span>
                </template>
                <span v-else class="t-xs muted">Saldo total en tus cuentas</span>
              </div>
              <svg v-if="chispa" class="mm-chart" viewBox="0 0 320 60" preserveAspectRatio="none" style="height: 60px; margin-top: 12px" aria-hidden="true">
                <path class="line" pathLength="1000" style="--len: 1000; stroke: var(--brand)" :d="chispa"></path>
              </svg>
            </div>
          </section>

          <!-- Escritorio: cuatro indicadores. En móvil quedan ingresos y gastos -->
          <div class="grid g4">
            <div class="mm-card mm-kpi mm-rise kpi-estatico mm-only-desktop" style="--i: 0">
              <div class="blob" style="background: var(--balance)"></div>
              <div class="row between" style="align-items: flex-start">
                <div><div class="t-over">Disponible</div><div class="t-xs muted" style="margin-top: 2px">Saldo total en tus cuentas</div></div>
                <div class="mm-ico balance"><MmIcon i="wallet" :s="22" /></div>
              </div>
              <div class="t-amt-lg" style="margin-top: 14px">{{ dinero(kpis.disponible.valor) }}</div>
              <div class="row" style="margin-top: 8px; min-height: 24px">
                <template v-if="dDisponible">
                  <span class="mm-delta" :class="dDisponible.clase"><MmIcon :i="dDisponible.flecha" :s="11" />{{ dDisponible.texto }}</span>
                  <span class="t-xs muted">vs. {{ etiquetas.previo }}</span>
                </template>
                <span v-else class="t-xs muted">Sin cambios frente a {{ etiquetas.previo }}</span>
              </div>
            </div>

            <div class="mm-card mm-kpi mm-rise kpi-estatico" style="--i: 1">
              <div class="blob" style="background: var(--income)"></div>
              <div class="row between" style="align-items: flex-start">
                <div><div class="t-over">Ingresos</div><div class="t-xs muted" style="margin-top: 2px">{{ etiquetas.acumulado }}</div></div>
                <div class="mm-ico income"><MmIcon i="trending-up" :s="22" /></div>
              </div>
              <div class="t-amt-lg income" style="margin-top: 14px">+ {{ dinero(kpis.ingresos.valor) }}</div>
              <div class="row" style="margin-top: 8px; min-height: 24px">
                <template v-if="dIngresos">
                  <span class="mm-delta" :class="dIngresos.clase"><MmIcon :i="dIngresos.flecha" :s="11" />{{ dIngresos.texto }}</span>
                  <span class="t-xs muted">vs. {{ etiquetas.previo }}</span>
                </template>
                <span v-else class="t-xs muted">Sin comparación con {{ etiquetas.previo }}</span>
              </div>
            </div>

            <div class="mm-card mm-kpi mm-rise kpi-estatico" style="--i: 2">
              <div class="blob" style="background: var(--expense)"></div>
              <div class="row between" style="align-items: flex-start">
                <div><div class="t-over">Gastos</div><div class="t-xs muted" style="margin-top: 2px">{{ etiquetas.acumulado }}</div></div>
                <div class="mm-ico expense"><MmIcon i="trending-down" :s="22" /></div>
              </div>
              <div class="t-amt-lg" style="margin-top: 14px">− {{ dinero(kpis.gastos.valor) }}</div>
              <div class="row" style="margin-top: 8px; min-height: 24px">
                <template v-if="dGastos">
                  <span class="mm-delta" :class="dGastos.clase"><MmIcon :i="dGastos.flecha" :s="11" />{{ dGastos.texto }}</span>
                  <span class="t-xs muted">{{ dGastos.sube ? "más" : "menos" }} que {{ etiquetas.previo }}</span>
                </template>
                <span v-else class="t-xs muted">Sin comparación con {{ etiquetas.previo }}</span>
              </div>
            </div>

            <div class="mm-card mm-kpi mm-rise kpi-estatico mm-only-desktop" style="--i: 3">
              <div class="blob" style="background: var(--brand)"></div>
              <div><div class="t-over">Tasa de ahorro</div><div class="t-xs muted" style="margin-top: 2px">Lo que no gastaste</div></div>
              <div class="row gap-4" style="margin-top: 6px">
                <div class="mm-ring" style="width: 84px; height: 84px">
                  <svg class="mm-donut" width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
                    <circle cx="42" cy="42" r="33" style="fill: none; stroke: var(--surface-2); stroke-width: 10"></circle>
                    <circle class="seg" pathLength="100" cx="42" cy="42" r="33" transform="rotate(-90 42 42)" :style="{stroke: 'var(--brand)', strokeWidth: 10, strokeDasharray: `${indiceDonut} 100`, animationDelay: '0.2s'}"></circle>
                  </svg>
                  <div><b class="t-h3 num">{{ kpis.ahorro === null ? "—" : `${kpis.ahorro} %` }}</b></div>
                </div>
                <div class="t-sm muted kpi-note" style="max-width: 130px">
                  <template v-if="kpis.ahorro === null">Registra ingresos para calcularla.</template>
                  <template v-else>De cada 100 que ingresaron, te quedaron <b style="color: var(--ink)">{{ kpis.ahorro }}</b>.</template>
                </div>
              </div>
            </div>
          </div>

          <!-- Flujo de dinero y gasto por categoría (escritorio) -->
          <div class="grid g-main mm-only-desktop">
            <div class="mm-card mm-rise" style="--i: 4">
              <div class="mm-card-h">
                <div><h3 class="t-h3">Flujo de dinero</h3><div class="t-xs muted">Últimos {{ flujo.length }} meses</div></div>
                <div class="mm-legend"><span><i class="mm-dot" style="background: var(--income)"></i>Ingresos</span><span><i class="mm-dot" style="background: var(--expense)"></i>Gastos</span></div>
              </div>
              <FlujoChart :serie="flujo" />
            </div>
            <div class="mm-card mm-rise" style="--i: 5">
              <div class="mm-card-h"><div><h3 class="t-h3">Gasto por categoría</h3><div class="t-xs muted">{{ etiquetas.actual }}</div></div></div>
              <DonutCategorias :ranking="ranking" :divisa="divisaPrincipal" />
            </div>
          </div>

          <!-- Móvil: gasto por categoría en barras -->
          <div class="mm-card mm-rise mm-only-mobile" style="--i: 4">
            <div class="mm-card-h"><h3 class="t-h3">Gasto por categoría</h3><span class="t-xs muted">{{ etiquetas.actual }}</span></div>
            <p v-if="!topCategorias.length" class="t-sm muted">Sin gastos en este periodo.</p>
            <div v-else class="col" style="gap: 12px">
              <div v-for="(c, i) in topCategorias" :key="c.categoriaId" class="col gap-1">
                <div class="row t-sm"><i class="mm-dot" :style="{background: c.colorCategoria}"></i><span class="grow ellipsis">{{ c.labelCategoria }}</span><b class="num">{{ dinero(c.montoCategoria) }}</b></div>
                <div class="mm-progress sm"><i :style="{'--w': `${totalGastoPeriodo ? Math.round((c.montoCategoria / totalGastoPeriodo) * 100) : 0}%`, '--c': c.colorCategoria, '--i': i}"></i></div>
              </div>
            </div>
          </div>

          <!-- Movimientos y cuentas -->
          <div class="grid g-main">
            <div class="mm-card mm-rise mm-only-desktop" style="--i: 6">
              <div class="mm-card-h"><h3 class="t-h3">Últimos movimientos</h3></div>
              <MovimientosRecientes />
            </div>

            <div class="mm-card mm-rise mm-only-mobile" style="--i: 5">
              <div class="mm-card-h"><h3 class="t-h3">Últimos movimientos</h3></div>
              <p v-if="!recientes.length" class="t-sm muted">Todavía no hay movimientos.</p>
              <div v-else class="mm-list">
                <button v-for="m in recientes.slice(0, 4)" :key="m._id" type="button" class="mm-row" style="width: 100%; border: 0; background: none; text-align: left; color: inherit" @click="abrirMovimiento(m._id, 'VIEW')">
                  <span class="mm-ico cat sm" :style="{background: colorMovil(m)}"><MmIcon :i="iconoMovil(m)" :s="18" /></span>
                  <span class="grow" style="min-width: 0">
                    <span class="t ellipsis" style="display: block">{{ describirMovimiento(m).titulo }}</span>
                    <span class="s" style="display: block">{{ fechaCorta(m.fecha) }}</span>
                  </span>
                  <span class="t-amt" :class="{income: m.tipo === 'INGRESO', info: m.tipo === 'TRANSFERENCIA'}">{{ montoConSigno(m) }}</span>
                </button>
              </div>
            </div>

            <div class="mm-only-desktop"><CuentasLista variante="lista" /></div>

            <div class="mm-card mm-rise mm-only-mobile" style="--i: 6">
              <div class="mm-card-h"><h3 class="t-h3">Mis cuentas</h3></div>
              <CuentasLista variante="tarjetas" />
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
/* Los indicadores aún no llevan a otra pantalla: se ven como tarjetas, no como enlaces */
.kpi-estatico {
  cursor: default;
}
@media (max-width: 720px) {
  /* En móvil las tarjetas de ingresos y gastos ocupan todo el ancho de su celda y se muestran compactas */
  .grid.g-main {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
