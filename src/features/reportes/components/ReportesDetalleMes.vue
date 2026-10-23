<script setup>
/** Panel con el detalle de un mes del resumen anual: cómo cerró, en qué se fue y accesos directos. */
import {ref, computed, onMounted} from "vue";
import {useRouter} from "vue-router";

import MmIcon from "@/components/mm/MmIcon.vue";
import {moneda, iconoDe} from "@/features/dashBoard/logic/formato.js";
import {filtros, limpiarFiltros, aInputFecha} from "@/features/movimientos/logic/filtrosMovimientos.js";
import {delMes, totales, gastoPorCategoria, inicioDeMes, finDeMes} from "../logic/calculos.js";
import {useReportes} from "../logic/useReportes.js";

const router = useRouter();
const {anio, mes, movimientos, divisa, mesDetalle} = useReportes();
const dinero = (v) => moneda(v, divisa.value);

const NOMBRES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const titulo = computed(() => `${NOMBRES[mesDetalle.value.mes]} ${mesDetalle.value.anio}`);

const delPeriodo = computed(() => delMes(movimientos.value, mesDetalle.value.anio, mesDetalle.value.mes));
const t = computed(() => totales(delPeriodo.value));
const categorias = computed(() => gastoPorCategoria(delPeriodo.value).slice(0, 5));

const panel = ref(null);
onMounted(() => panel.value?.focus());
const cerrar = () => (mesDetalle.value = null);

function verMovimientos() {
  const {anio: a, mes: m} = mesDetalle.value;
  limpiarFiltros();
  filtros.preset = "personalizado";
  filtros.desde = aInputFecha(inicioDeMes(a, m));
  filtros.hasta = aInputFecha(finDeMes(a, m));
  cerrar();
  router.push("/movimientos");
}
function verCierre() {
  anio.value = mesDetalle.value.anio;
  mes.value = mesDetalle.value.mes;
  cerrar();
  router.push("/reportes/cierre");
}
</script>

<template>
  <div class="mm-root" data-theme="light">
    <div class="mm-overlay right" @click.self="cerrar">
      <div ref="panel" class="mm-drawer" role="dialog" aria-modal="true" aria-labelledby="detalle-mes-titulo" tabindex="-1" style="width: min(440px, 100%); outline: 0" @keydown.esc="cerrar">
        <div class="mm-modal-h">
          <div class="grow"><div class="t-over">Detalle del mes</div><h2 id="detalle-mes-titulo" class="t-h2">{{ titulo }}</h2></div>
          <button type="button" class="mm-x" aria-label="Cerrar" @click="cerrar"><MmIcon i="close" :s="20" /></button>
        </div>
        <div class="mm-modal-b" style="flex: 1">
          <div class="grid g2" style="gap: 12px">
            <div class="mm-card flat" style="padding: 14px; background: var(--surface-2); border: 0"><div class="t-over">Ingresos</div><b class="t-h3 num income">{{ dinero(t.ingresos) }}</b></div>
            <div class="mm-card flat" style="padding: 14px; background: var(--surface-2); border: 0"><div class="t-over">Gastos</div><b class="t-h3 num">{{ dinero(t.gastos) }}</b></div>
          </div>
          <div class="row between">
            <span class="t-label">Ahorro</span>
            <span class="row gap-2"><b class="num" :class="{expense: t.ahorro < 0}">{{ t.ahorro < 0 ? "−" : "" }}{{ dinero(Math.abs(t.ahorro)) }}</b><span v-if="t.tasa !== null" class="mm-badge" :class="t.tasa >= 0 ? 'income' : 'expense'">{{ t.tasa }} %</span></span>
          </div>
          <div>
            <div class="t-over" style="margin-bottom: 8px">En qué se fue</div>
            <p v-if="!categorias.length" class="t-sm muted">Sin gastos este mes.</p>
            <div class="col" style="gap: 2px">
              <div v-for="c in categorias" :key="c.id" class="mm-row" style="margin: 0; cursor: default">
                <div class="mm-ico sm cat" :style="{width: '30px', height: '30px', borderRadius: '9px', background: c.color}"><MmIcon :i="iconoDe(c.icono)" :s="15" /></div>
                <span class="grow t">{{ c.nombre }}</span>
                <b class="num t-sm">{{ dinero(c.monto) }}</b>
                <span class="muted num t-xs" style="width: 40px; text-align: right">{{ Math.round(c.pct) }} %</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mm-modal-f">
          <button type="button" class="mm-btn" @click="verMovimientos">Ver movimientos</button>
          <button type="button" class="mm-btn primary" @click="verCierre">Ver cierre del mes</button>
        </div>
      </div>
    </div>
  </div>
</template>
