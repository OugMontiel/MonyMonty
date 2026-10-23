<script setup>
/**
 * Reportes · Gasto por categoría del mes: dona con el reparto, y al elegir una categoría su
 * comparación con tus meses anteriores y en qué subcategorías se fue la plata.
 */
import {ref, computed, watch} from "vue";
import {useRouter} from "vue-router";

import MmIcon from "@/components/mm/MmIcon.vue";
import MmTopbar from "@/components/mm/layout/MmTopbar.vue";
import {moneda, compacto, iconoDe, porcentaje, nombreMesCorto} from "@/features/dashBoard/logic/formato.js";
import {filtros, limpiarFiltros, aInputFecha} from "@/features/movimientos/logic/filtrosMovimientos.js";
import ReportesTabs from "../components/ReportesTabs.vue";
import {delMes, esFlujo, gastoPorCategoria, finDeMes, inicioDeMes} from "../logic/calculos.js";
import {useReportes} from "../logic/useReportes.js";

const router = useRouter();
const {anio, mes, movimientos, divisa, cargando, error, etiquetaMes, cargar, exportarAbierto} = useReportes();
const dinero = (v) => moneda(v, divisa.value);

const delPeriodo = computed(() => delMes(movimientos.value, anio.value, mes.value));
const categorias = computed(() => gastoPorCategoria(delPeriodo.value));
const total = computed(() => categorias.value.reduce((s, c) => s + c.monto, 0));
const sinDatos = computed(() => !cargando.value && !error.value && categorias.value.length === 0);

const elegida = ref(null);
// Al cambiar de mes se vuelve a la categoría que más pesa
watch(categorias, (lista) => {
  if (!lista.some((c) => c.id === elegida.value)) elegida.value = lista[0]?.id ?? null;
}, {immediate: true});
const actual = computed(() => categorias.value.find((c) => c.id === elegida.value) ?? null);

// ---------- Dona ----------
const RADIO = 80;
const segmentos = computed(() => {
  let acumulado = 0;
  return categorias.value.map((c, i) => {
    const seg = {id: c.id, color: c.color, largo: Math.max(c.pct - 0.6, 0.3), desfase: -acumulado, grueso: c.id === elegida.value ? 30 : 22, opaco: c.id === elegida.value ? 1 : 0.55, retraso: (0.1 + i * 0.07).toFixed(2)};
    acumulado += c.pct;
    return seg;
  });
});

// ---------- Historial de la categoría elegida (6 meses, el último es el que se mira) ----------
const historial = computed(() => {
  if (!actual.value) return [];
  return Array.from({length: 6}, (_, i) => {
    const f = new Date(anio.value, mes.value - (5 - i), 1);
    const monto = delMes(movimientos.value, f.getFullYear(), f.getMonth())
      .filter((m) => esFlujo(m) && m.tipo === "EGRESO" && (m.categoriaId ?? "sin-categoria") === actual.value.id)
      .reduce((s, m) => s + m.monto, 0);
    return {mes: nombreMesCorto(f), monto};
  });
});
const maxHistorial = computed(() => Math.max(1, ...historial.value.map((h) => h.monto)));
// Promedio de los 5 meses anteriores (solo los que tuvieron gasto en esta categoría)
const promedio = computed(() => {
  const previos = historial.value.slice(0, 5).filter((h) => h.monto > 0);
  return previos.length ? previos.reduce((s, h) => s + h.monto, 0) / previos.length : 0;
});
const rotuloPromedio = computed(() => `Promedio ${historial.value[0]?.mes.toLowerCase()}–${historial.value[4]?.mes.toLowerCase()}`);
const comparacion = computed(() => {
  if (!actual.value || !promedio.value) return {texto: "Sin meses anteriores para comparar", tono: ""};
  const p = Math.round(((actual.value.monto - promedio.value) / promedio.value) * 100);
  if (Math.abs(p) < 3) return {texto: "Igual a tu promedio", tono: ""};
  return p > 0 ? {texto: `${p} % por encima de tu promedio`, tono: p > 20 ? "expense" : "warn"} : {texto: `${Math.abs(p)} % por debajo de tu promedio`, tono: "income"};
});

// ---------- En qué se fue (subcategorías) ----------
const subcategorias = computed(() => {
  if (!actual.value) return [];
  const mapa = new Map();
  for (const m of delPeriodo.value) {
    if (!esFlujo(m) || m.tipo !== "EGRESO" || (m.categoriaId ?? "sin-categoria") !== actual.value.id) continue;
    const n = m.subcategoria?.subcategoria ?? "Sin subcategoría";
    const f = mapa.get(n) ?? {nombre: n, monto: 0, cantidad: 0};
    f.monto += m.monto;
    f.cantidad++;
    mapa.set(n, f);
  }
  return [...mapa.values()].sort((a, b) => b.monto - a.monto).slice(0, 4);
});

/** Abre Movimientos ya filtrado por esta categoría y este mes */
function verMovimientos() {
  limpiarFiltros();
  filtros.categorias = [actual.value.id];
  filtros.preset = "personalizado";
  filtros.desde = aInputFecha(inicioDeMes(anio.value, mes.value));
  filtros.hasta = aInputFecha(finDeMes(anio.value, mes.value));
  router.push("/movimientos");
}
</script>

<template>
  <div class="mm-page">
    <MmTopbar migas="Reportes" titulo="Gasto por categoría" :periodo="null" cta="Exportar" cta-icono="download" cta-personalizado @cta="exportarAbierto = true" />

    <div class="mm-content" :aria-busy="cargando">
      <ReportesTabs activa="categorias" />

      <div v-if="error" class="mm-banner expense" role="alert">
        <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ error }}</span>
        <button type="button" class="mm-btn sm" @click="cargar"><MmIcon i="refresh" :s="16" />Reintentar</button>
      </div>

      <div v-if="cargando" class="mm-card" role="status" aria-label="Cargando el reporte"><div class="mm-skel" style="width: 100%; height: 360px"></div></div>

      <div v-else-if="sinDatos" class="mm-card">
        <div class="mm-empty">
          <h3 class="t-h3">Sin gastos en {{ etiquetaMes }}</h3>
          <p class="t-sm muted">Elige otro mes con las flechas o registra tus gastos para ver su reparto.</p>
        </div>
      </div>

      <div v-else-if="!error && actual" class="grid reparto">
        <div class="mm-card mm-rise">
          <div class="mm-card-h"><h3 class="t-h3">Reparto del mes</h3><span class="t-xs muted">Toca una categoría</span></div>
          <div style="position: relative; width: 200px; height: 200px; margin: 4px auto 18px">
            <svg class="mm-donut" width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" :r="RADIO" style="fill: none; stroke: var(--surface-2); stroke-width: 24"></circle>
              <circle
                v-for="g in segmentos"
                :key="g.id"
                class="seg"
                pathLength="100"
                cx="100"
                cy="100"
                :r="RADIO"
                transform="rotate(-90 100 100)"
                :style="{stroke: g.color, strokeWidth: g.grueso, strokeDasharray: `${g.largo} 100`, strokeDashoffset: g.desfase, opacity: g.opaco, animationDelay: `${g.retraso}s`, transition: 'stroke-width var(--dur-base) var(--ease-spring), opacity var(--dur-base)'}"
              ></circle>
            </svg>
            <div style="position: absolute; inset: 0; display: grid; place-items: center; text-align: center">
              <div><div class="t-xs muted">{{ actual.nombre }}</div><div class="t-h2 num">{{ Math.round(actual.pct) }} %</div><div class="t-xs muted num">{{ dinero(actual.monto) }}</div></div>
            </div>
          </div>
          <div class="col" style="gap: 4px">
            <button v-for="c in categorias" :key="c.id" type="button" class="mm-row fila-cat" :style="{background: c.id === elegida ? 'var(--surface-2)' : 'transparent'}" :aria-pressed="c.id === elegida" @click="elegida = c.id">
              <div class="mm-ico sm cat" :style="{width: '30px', height: '30px', borderRadius: '9px', background: c.color}"><MmIcon :i="iconoDe(c.icono)" :s="15" /></div>
              <span class="grow t ellipsis">{{ c.nombre }}</span>
              <b class="num t-sm">{{ dinero(c.monto) }}</b>
              <span class="muted num t-xs" style="width: 40px; text-align: right">{{ Math.round(c.pct) }} %</span>
            </button>
          </div>
          <div class="row between t-sm" style="border-top: 1px solid var(--line); padding-top: 12px; margin-top: 8px"><b>Total</b><b class="num">{{ dinero(total) }}</b></div>
        </div>

        <div class="col gap-6">
          <div class="mm-card mm-rise" style="--i: 1">
            <div class="row gap-3" style="flex-wrap: wrap">
              <div class="mm-ico lg cat mm-popin" :style="{background: actual.color}"><MmIcon :i="iconoDe(actual.icono)" :s="24" /></div>
              <div class="grow"><div class="t-over">Categoría</div><h2 class="t-h2">{{ actual.nombre }}</h2></div>
              <span class="mm-badge" :class="comparacion.tono">{{ comparacion.texto }}</span>
            </div>
            <div class="grid g3" style="gap: 12px; margin-top: 18px">
              <div class="mm-card flat" style="padding: 14px; background: var(--surface-2); border: 0"><div class="t-over">Este mes</div><b class="t-h3 num">{{ dinero(actual.monto) }}</b></div>
              <div class="mm-card flat" style="padding: 14px; background: var(--surface-2); border: 0"><div class="t-over">{{ rotuloPromedio }}</div><b class="t-h3 num">{{ promedio ? dinero(promedio) : "—" }}</b></div>
              <div class="mm-card flat" style="padding: 14px; background: var(--surface-2); border: 0"><div class="t-over">Movimientos</div><b class="t-h3 num">{{ actual.cantidad }}</b></div>
            </div>
            <div class="t-over" style="margin: 20px 0 8px">Últimos 6 meses · el último es el que estás viendo</div>
            <div class="row" style="align-items: flex-end; gap: 14px; height: 150px; padding: 0 4px">
              <div v-for="(h, i) in historial" :key="h.mes + i" class="col grow" style="align-items: center; gap: 6px; height: 100%; justify-content: flex-end">
                <span class="t-xs num" style="font-weight: 700">{{ h.monto ? compacto(h.monto) : "0" }}</span>
                <i :style="{display: 'block', width: '100%', maxWidth: '54px', height: `${Math.max(4, Math.round((h.monto / maxHistorial) * 82))}%`, borderRadius: '8px 8px 4px 4px', background: i === 5 ? actual.color : 'var(--surface-3)', transition: 'height var(--dur-slow) var(--ease-spring)'}"></i>
                <span class="t-xs muted">{{ h.mes }}</span>
              </div>
            </div>
          </div>

          <div class="mm-card mm-rise" style="--i: 2">
            <div class="mm-card-h"><h3 class="t-h3">En qué se fue</h3><button type="button" class="t-sm enlace" @click="verMovimientos">Ver movimientos</button></div>
            <div class="col" style="gap: 2px">
              <div v-for="s in subcategorias" :key="s.nombre" class="mm-row" style="margin: 0; cursor: default">
                <div class="mm-avatar" style="width: 34px; height: 34px; font-size: 12px; background: var(--surface-2); color: var(--ink-muted)">{{ s.nombre.slice(0, 2).toUpperCase() }}</div>
                <div class="grow"><div class="t">{{ s.nombre }}</div><div class="s">{{ s.cantidad }} {{ s.cantidad === 1 ? "movimiento" : "movimientos" }}</div></div>
                <b class="num t-sm">{{ dinero(s.monto) }}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mm-page {
  display: contents;
}
.reparto {
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 24px;
  align-items: start;
}
.fila-cat {
  margin: 0;
  width: 100%;
  font: inherit;
  color: inherit;
  text-align: left;
  border: 0;
  cursor: pointer;
}
.enlace {
  border: 0;
  background: none;
  padding: 0;
  color: var(--brand-ink);
  font-weight: 700;
}
.enlace:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
@media (max-width: 1100px) {
  .reparto {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
