<script setup>
/**
 * Primer uso (S19): mientras no haya movimientos propios se muestran los primeros pasos
 * en lugar de un tablero lleno de ceros. Los pasos se marcan solos según los datos reales.
 */
import {computed} from "vue";

import {useAppUi} from "@/composables/useAppUi.js";
import {useTablero} from "../../logic/useTablero.js";
import {moneda} from "../../logic/formato.js";
import MmIcon from "@/components/mm/MmIcon.vue";

defineProps({nombre: {type: String, default: ""}});

const {nuevoMovimiento, nuevaCuenta, nuevaCategoria} = useAppUi();
const {cuentas} = useTablero();

const primeraCuenta = computed(() => cuentas.value[0]);

const pasos = computed(() => [
  {
    titulo: "Agrega tu primera cuenta",
    detalle: primeraCuenta.value ? `${primeraCuenta.value.nombre} · ${moneda(primeraCuenta.value.saldo, primeraCuenta.value.divisaId)}` : "Donde tienes tu plata hoy",
    icono: "wallet",
    tono: "income",
    hecho: cuentas.value.length > 0,
    cta: "Crear",
    accion: nuevaCuenta,
  },
  {
    titulo: "Registra tu primer movimiento",
    detalle: "Toma 5 segundos",
    icono: "add-circle",
    tono: "brand",
    hecho: false,
    cta: "Registrar",
    accion: nuevoMovimiento,
    principal: true,
  },
  {
    titulo: "Crea una categoría a tu medida",
    detalle: "Con su icono y color",
    icono: "pricetags",
    tono: "balance",
    hecho: false,
    cta: "Crear",
    accion: nuevaCategoria,
  },
]);

const hechos = computed(() => pasos.value.filter((p) => p.hecho).length);
const pct = computed(() => Math.round((hechos.value / pasos.value.length) * 100));
</script>

<template>
  <div class="col" style="gap: var(--space-6)">
    <section class="mm-hero mm-rise" style="padding: 36px 40px; display: flex; flex-wrap: wrap; gap: 32px; align-items: center">
      <div class="orb mm-float" style="width: 300px; height: 300px; right: -60px; top: -120px; background: var(--brand); opacity: 0.4"></div>
      <div class="orb mm-float" style="width: 160px; height: 160px; right: 260px; bottom: -90px; background: var(--income); opacity: 0.3; animation-delay: -2s"></div>
      <div class="grow" style="position: relative; min-width: min(320px, 100%)">
        <div class="t-over" style="color: color-mix(in srgb, var(--bg) 70%, transparent)">Bienvenida</div>
        <h2 class="t-h1" style="margin-top: 6px; font-size: 32px; line-height: 38px">{{ nombre ? `${nombre}, tu` : "Tu" }} tablero cobra vida con tu primer movimiento.</h2>
        <p class="muted" style="margin-top: 8px; max-width: 560px">Completa estos pasos y en lugar de ceros verás tu saldo, a dónde se va tu plata y cuánto gastas cada mes.</p>
      </div>
      <div style="position: relative" class="col gap-2">
        <div class="mm-ring" style="width: 120px; height: 120px">
          <svg class="mm-donut" width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="50" style="fill: none; stroke: color-mix(in srgb, var(--bg) 16%, transparent); stroke-width: 12"></circle>
            <circle class="seg" pathLength="100" cx="60" cy="60" r="50" transform="rotate(-90 60 60)" :style="{stroke: 'var(--brand)', strokeWidth: 12, strokeLinecap: 'round', strokeDasharray: `${pct} 100`}"></circle>
          </svg>
          <div><b class="t-h2 num">{{ hechos }}/{{ pasos.length }}</b><div class="t-xs muted">pasos</div></div>
        </div>
      </div>
    </section>

    <div class="grid g-main">
      <div class="mm-card mm-rise" style="--i: 2">
        <div class="mm-card-h">
          <div><h3 class="t-h3">Tus primeros pasos</h3><div class="t-xs muted">Se marcan solos cuando los completas</div></div>
          <span class="mm-badge brand">{{ hechos }} de {{ pasos.length }}</span>
        </div>
        <div class="mm-list">
          <div v-for="(p, k) in pasos" :key="p.titulo" class="mm-row mm-rise" :style="{'--i': k}">
            <span class="mm-check" :class="{'is-on': p.hecho}" style="width: 24px; height: 24px; border-radius: 8px" role="img" :aria-label="p.hecho ? 'Paso hecho' : 'Paso pendiente'">
              <MmIcon v-if="p.hecho" i="checkmark" :s="14" />
            </span>
            <div class="mm-ico sm" :class="p.tono"><MmIcon :i="p.icono" :s="18" /></div>
            <div class="grow"><div class="t">{{ p.titulo }}</div><div class="s">{{ p.detalle }}</div></div>
            <button type="button" class="mm-btn sm" :class="p.hecho ? 'ghost' : p.principal ? 'primary' : ''" @click="p.accion">{{ p.hecho ? "Ver" : p.cta }}</button>
          </div>
        </div>
      </div>

      <div class="col gap-6">
        <div class="mm-card mm-rise" style="--i: 3">
          <div class="mm-empty" style="padding: 16px">
            <div class="art" style="width: 96px; height: 96px">
              <div class="mm-ico lg brand mm-float" style="width: 56px; height: 56px; border-radius: 18px"><MmIcon i="stats-chart" :s="26" /></div>
            </div>
            <h3 class="t-h3">Aquí verás tu flujo de dinero</h3>
            <p class="t-sm muted" style="max-width: 300px">Con tus primeros movimientos dibujamos tu gráfica de ingresos y gastos.</p>
            <button type="button" class="mm-btn primary" @click="nuevoMovimiento"><MmIcon i="add" :s="18" />Registrar movimiento</button>
          </div>
        </div>
        <div class="mm-card mm-rise" style="--i: 4">
          <div class="row gap-3">
            <div class="mm-ico info"><MmIcon i="bulb" :s="22" /></div>
            <div class="grow">
              <div class="t-label">Tip para empezar</div>
              <div class="t-sm muted">Registra el gasto apenas lo hagas: con la tecla <span class="mm-kbd">N</span> abres el formulario desde cualquier pantalla.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
