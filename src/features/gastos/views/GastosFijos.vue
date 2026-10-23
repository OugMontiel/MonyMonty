<script setup>
/**
 * Mis gastos · Fijos y suscripciones: lo que se cobra cada mes (arriendo, servicios, suscripciones),
 * qué ya se pagó este mes, cuándo viene el próximo cobro y cómo pesa sobre los ingresos.
 */
import {computed, ref} from "vue";

import MmIcon from "@/components/mm/MmIcon.vue";
import MmTopbar from "@/components/mm/layout/MmTopbar.vue";
import {useAppUi} from "@/composables/useAppUi.js";
import {moneda, compacto, iconoDe, nombreMes, nombreMesCorto} from "@/features/dashBoard/logic/formato.js";
import {useReportes} from "@/features/reportes/logic/useReportes.js";
import GastosTabs from "../components/GastosTabs.vue";
import {detectarFijos, estadoDeCobro, resumenDeFijos, repartoDeFijos} from "../logic/fijos.js";

const {abrirMovimiento, nuevoMovimiento} = useAppUi();
const {movimientos, divisa, cargando, error, hoy, cargar} = useReportes();
const dinero = (v) => moneda(v, divisa.value);

const soloSuscripciones = ref(false);
const fijos = computed(() => detectarFijos(movimientos.value, hoy));
const r = computed(() => resumenDeFijos(fijos.value, movimientos.value, hoy));
const reparto = computed(() => repartoDeFijos(fijos.value));
const mesCorto = computed(() => nombreMesCorto(hoy).toLowerCase());
const mesLargo = computed(() => nombreMes(hoy));

const filas = computed(() =>
  fijos.value
    .filter((f) => !soloSuscripciones.value || f.suscripcion)
    .map((f) => ({...f, estado: estadoDeCobro(f, hoy, mesCorto.value)}))
);
const hayFijos = computed(() => !cargando.value && !error.value && fijos.value.length > 0);
const sinFijos = computed(() => !cargando.value && !error.value && fijos.value.length === 0);

// ---------- Calendario del mes ----------
const diasDelMes = computed(() => new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate());
const avance = computed(() => (hoy.getDate() / diasDelMes.value) * 100);
const puntos = computed(() => {
  const vistos = new Set();
  return fijos.value.map((f, k) => {
    // Dos cobros el mismo día se separan un poco para que no se tapen
    const apilado = vistos.has(f.dia);
    vistos.add(f.dia);
    return {k, x: Math.min(97, (f.dia / diasDelMes.value) * 100 + (apilado ? 3.4 : 0)), dia: f.dia, valor: compacto(f.monto), color: f.pagado ? "var(--income)" : "var(--expense)", nombre: f.nombre};
  });
});

const pctTexto = computed(() => (r.value.pctIngresos === null ? "—" : `${r.value.pctIngresos} %`));
const tonoPct = computed(() => (r.value.pctIngresos !== null && r.value.pctIngresos >= 50 ? "var(--warning)" : "var(--income)"));
</script>

<template>
  <div class="mm-page">
    <MmTopbar migas="Mi dinero · Mis gastos" titulo="Fijos y suscripciones" :periodo="null" cta="Registrar gasto" />

    <div class="mm-content" :aria-busy="cargando">
      <GastosTabs activa="fijos" :con-mes="false" />

      <div v-if="error" class="mm-banner expense" role="alert">
        <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ error }}</span>
        <button type="button" class="mm-btn sm" @click="cargar"><MmIcon i="refresh" :s="16" />Reintentar</button>
      </div>

      <div v-if="cargando" class="mm-card" role="status" aria-label="Cargando tus gastos fijos"><div class="mm-skel" style="width: 100%; height: 340px"></div></div>

      <div v-else-if="sinFijos" class="mm-card">
        <div class="mm-empty">
          <div class="art"><div class="mm-ico lg info mm-float" style="width: 56px; height: 56px; border-radius: 18px"><MmIcon i="calendar" :s="26" /></div></div>
          <h3 class="t-h3">Aún no tienes gastos fijos</h3>
          <p class="t-sm muted" style="max-width: 380px">Al registrar un gasto que se repite cada mes (arriendo, servicios, una suscripción) activa “Se repite” y aparecerá aquí con su calendario de cobros.</p>
          <button type="button" class="mm-btn primary" @click="nuevoMovimiento"><MmIcon i="add" :s="18" />Registrar un gasto</button>
        </div>
      </div>

      <template v-else-if="hayFijos">
        <div class="grid g4">
          <div class="mm-card mm-kpi mm-rise" style="--i: 0">
            <div class="blob" style="background: var(--expense)"></div>
            <div class="t-over">Fijos al mes</div>
            <div class="t-amt-lg" style="margin-top: 10px">{{ dinero(r.total) }}</div>
            <div class="t-xs muted" style="margin-top: 8px">{{ r.cantidad }} {{ r.cantidad === 1 ? "cobro programado" : "cobros programados" }}</div>
          </div>
          <div class="mm-card mm-kpi mm-rise" style="--i: 1">
            <div class="blob" style="background: var(--warning)"></div>
            <div class="t-over">De tus ingresos</div>
            <div class="t-amt-lg" :style="{marginTop: '10px', color: tonoPct}">{{ pctTexto }}</div>
            <div class="t-xs muted" style="margin-top: 8px">{{ r.pctIngresos === null ? "Aún sin ingresos para comparar" : "Lo sano es menos del 50 %" }}</div>
          </div>
          <div class="mm-card mm-kpi mm-rise" style="--i: 2">
            <div class="blob" style="background: var(--income)"></div>
            <div class="t-over">Ya pagado</div>
            <div class="t-amt-lg" style="margin-top: 10px">{{ dinero(r.pagado) }}</div>
            <div class="t-xs muted" style="margin-top: 8px">{{ r.cantidadPagados }} de {{ r.cantidad }} cobros de {{ mesLargo }}</div>
          </div>
          <div class="mm-card mm-kpi mm-rise" style="--i: 3">
            <div class="blob" style="background: var(--info)"></div>
            <div class="t-over">Próximo cobro</div>
            <div class="t-amt-lg" style="margin-top: 10px">{{ r.proximo ? dinero(r.proximo.monto) : "—" }}</div>
            <div class="t-xs muted ellipsis" style="margin-top: 8px">{{ r.proximo ? `${r.proximo.nombre} · ${r.proximo.dia} ${mesCorto}` : `Nada más por cobrar en ${mesLargo}` }}</div>
          </div>
        </div>

        <div class="mm-card mm-rise" style="--i: 4">
          <div class="mm-card-h">
            <div><h3 class="t-h3">Calendario de {{ mesLargo }}</h3><div class="t-xs muted">Cada punto es un cobro · hoy es {{ hoy.getDate() }}</div></div>
            <div class="mm-legend">
              <span><i class="mm-dot" style="background: var(--income)"></i>Pagado</span>
              <span><i class="mm-dot" style="background: var(--expense)"></i>Pendiente</span>
            </div>
          </div>
          <div style="position: relative; height: 92px; margin: 8px 6px 0" role="img" :aria-label="`${r.cantidad} cobros en ${mesLargo}, ${r.cantidadPagados} pagados`">
            <div style="position: absolute; left: 0; right: 0; top: 24px; height: 6px; border-radius: 6px; background: var(--surface-2)"></div>
            <div :style="{position: 'absolute', left: 0, width: `${avance}%`, top: '24px', height: '6px', borderRadius: '6px', background: 'var(--brand)'}"></div>
            <div v-for="p in puntos" :key="p.k" class="mm-popin" :style="{'--i': p.k, position: 'absolute', left: `${p.x}%`, top: 0, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'}" :title="`${p.nombre} · día ${p.dia}`">
              <span class="t-xs" style="font-weight: 800; white-space: nowrap">{{ p.valor }}</span>
              <i :style="{width: '14px', height: '14px', borderRadius: '50%', background: p.color, boxShadow: '0 0 0 3px var(--surface)'}"></i>
              <span class="t-xs muted">{{ p.dia }}</span>
            </div>
          </div>
        </div>

        <div class="grid g-main">
          <div class="mm-card pad0 mm-rise" style="--i: 5">
            <div class="mm-card-h" style="padding: 20px 20px 0">
              <h3 class="t-h3">Tus cobros fijos</h3>
              <div class="mm-seg" :style="{'--n': 2, '--on': soloSuscripciones ? 1 : 0}" role="group" aria-label="Filtrar cobros">
                <i class="thumb"></i>
                <button type="button" :class="{'is-on': !soloSuscripciones}" :aria-pressed="!soloSuscripciones" @click="soloSuscripciones = false">Todos</button>
                <button type="button" :class="{'is-on': soloSuscripciones}" :aria-pressed="soloSuscripciones" @click="soloSuscripciones = true">Suscripciones</button>
              </div>
            </div>
            <div class="mm-list" style="padding: 8px 12px 12px">
              <p v-if="!filas.length" class="t-sm muted" style="padding: 16px 8px">Ninguno de tus fijos está en la categoría Suscripciones.</p>
              <button v-for="f in filas" :key="f.clave" type="button" class="mm-row fila-fijo" @click="abrirMovimiento(f.id)">
                <div class="mm-ico sm cat" :style="{background: f.categoria?.color ?? 'var(--cat-slate)'}"><MmIcon :i="iconoDe(f.categoria?.icono)" :s="18" /></div>
                <div class="grow">
                  <div class="t ellipsis">{{ f.nombre }}</div>
                  <div class="s ellipsis">{{ [f.categoria?.categoria, `día ${f.dia}`, f.cuenta].filter(Boolean).join(" · ") }}</div>
                </div>
                <span class="mm-badge" :class="f.estado.tono">{{ f.estado.texto }}</span>
                <b class="t-amt" style="min-width: 110px; text-align: right">− {{ dinero(f.monto) }}</b>
              </button>
            </div>
          </div>

          <div class="mm-card mm-rise" style="--i: 6">
            <h3 class="t-h3">Cómo se reparten</h3>
            <div class="row" style="height: 12px; border-radius: 999px; overflow: hidden; gap: 2px; margin: 14px 0 12px">
              <i v-for="g in reparto" :key="g.nombre" :style="{width: `${g.pct}%`, height: '100%', background: g.color}"></i>
            </div>
            <div class="col gap-2 t-sm">
              <div v-for="g in reparto.slice(0, 6)" :key="g.nombre" class="row gap-2">
                <i class="mm-dot" :style="{background: g.color}"></i><span class="grow ellipsis">{{ g.nombre }}</span><b class="num">{{ dinero(g.monto) }}</b>
              </div>
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
.fila-fijo {
  margin: 0;
  width: 100%;
  font: inherit;
  color: inherit;
  text-align: left;
  border: 0;
  background: transparent;
  cursor: pointer;
}
</style>
