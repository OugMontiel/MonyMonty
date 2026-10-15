<script setup>
/**
 * Panel lateral de filtros avanzados de la lista de movimientos: fechas, tipo, cuentas,
 * categorías y rango de monto. Los filtros se aplican mientras se eligen; el botón final
 * solo cierra el panel mostrando cuántos movimientos quedaron.
 */
import {computed, watch, nextTick, ref} from "vue";

import MmIcon from "@/components/mm/MmIcon.vue";
import {useTablero} from "@/features/dashBoard/logic/useTablero.js";
import {iconoDe, TIPOS_ENTIDAD, ENTIDAD_GENERICA, TIPOS_MOVIMIENTO, moneda} from "@/features/dashBoard/logic/formato.js";
import {movimientos} from "../logic/movimientosStore.js";
import {filtros, PRESETS_FECHA, aplicarFiltros, rangoEfectivo, aInputFecha, limpiarFiltros, alternarEn} from "../logic/filtrosMovimientos.js";

const visible = defineModel({type: Boolean, required: true});
defineProps({
  // Movimientos que quedan con los filtros actuales
  total: {type: Number, default: 0},
});

const {cuentas} = useTablero();
const panel = ref(null);

const cerrar = () => (visible.value = false);

watch(visible, async (abierto) => {
  if (!abierto) return;
  await nextTick();
  panel.value?.focus();
});

// ---------- Fechas ----------
function elegirPreset(id) {
  if (filtros.preset === id) {
    filtros.preset = null;
    return;
  }
  if (id === "personalizado") {
    // Parte del rango que se estaba viendo para que las fechas no queden vacías
    const r = rangoEfectivo();
    filtros.desde = aInputFecha(r.inicio);
    filtros.hasta = aInputFecha(r.fin);
  }
  filtros.preset = id;
}

const rango = computed(() => rangoEfectivo());
const desdeTexto = computed(() => aInputFecha(rango.value.inicio));
const hastaTexto = computed(() => aInputFecha(rango.value.fin));

/** Escribir una fecha convierte el filtro en un rango personalizado */
function editarFecha(campo, valor) {
  if (filtros.preset !== "personalizado") {
    filtros.desde = desdeTexto.value;
    filtros.hasta = hastaTexto.value;
    filtros.preset = "personalizado";
  }
  filtros[campo] = valor;
}

// ---------- Tipo ----------
const TIPOS = ["EGRESO", "INGRESO", "TRANSFERENCIA"];
const etiquetaTipo = {EGRESO: "Gastos", INGRESO: "Ingresos", TRANSFERENCIA: "Transf."};
const indiceTipo = computed(() => Math.max(0, TIPOS.indexOf(filtros.tipo)));

function elegirTipo(t) {
  filtros.tipo = filtros.tipo === t ? null : t;
}

// ---------- Cuentas y categorías (con cuántos movimientos tiene cada una en el rango) ----------
const tipoDe = (c) => TIPOS_ENTIDAD[c.tipo] ?? ENTIDAD_GENERICA;

const enRango = computed(() => aplicarFiltros(movimientos.value, {ignorar: ["cuentas", "categorias"]}));

const listaCuentas = computed(() =>
  cuentas.value.map((c) => ({
    ...c,
    cantidad: enRango.value.filter((m) => [m.entidadId, m.transferencia?.origenEntidadId, m.transferencia?.destinoEntidadId].includes(c.id)).length,
  }))
);

const listaCategorias = computed(() => {
  const mapa = new Map();
  for (const m of movimientos.value) {
    if (m.categoriaId && m.categoria && !mapa.has(m.categoriaId)) mapa.set(m.categoriaId, {id: m.categoriaId, nombre: m.categoria.categoria, color: m.categoria.color});
  }
  return [...mapa.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
});

const divisa = computed(() => movimientos.value.find((m) => m.divisaId)?.divisaId ?? "COP");
const resumenMonto = computed(() => {
  const min = filtros.montoMin !== null && filtros.montoMin !== "";
  const max = filtros.montoMax !== null && filtros.montoMax !== "";
  if (!min && !max) return "Cualquier monto";
  return `${min ? moneda(filtros.montoMin, divisa.value) : "$ 0"} – ${max ? moneda(filtros.montoMax, divisa.value) : "sin tope"}`;
});

// Los campos numéricos entregan "" al vaciarse: se guarda null
const comoNumero = (v) => (v === "" || v === null || v === undefined ? null : Number(v));
</script>

<template>
  <div v-if="visible" class="mm-overlay right" @click.self="cerrar">
    <div ref="panel" class="mm-drawer" role="dialog" aria-modal="true" aria-labelledby="filtros-titulo" tabindex="-1" style="width: min(460px, 100%); outline: 0" @keydown.esc="cerrar">
      <div class="mm-modal-h" style="border-bottom: 1px solid var(--line); padding-bottom: 18px">
        <div class="mm-ico brand"><MmIcon i="filter" :s="22" /></div>
        <div class="grow"><h2 id="filtros-titulo" class="t-h2">Filtros</h2><p class="t-sm muted">Se aplican mientras eliges</p></div>
        <button type="button" class="mm-x" aria-label="Cerrar" @click="cerrar"><MmIcon i="close" :s="20" /></button>
      </div>

      <div class="mm-modal-b" style="padding-top: 20px; gap: 22px; flex: 1; overflow: auto">
        <!-- Fechas -->
        <div class="mm-field">
          <span class="mm-flabel">Fechas</span>
          <div class="row" style="flex-wrap: wrap; gap: 8px">
            <button v-for="p in PRESETS_FECHA" :key="p.id" type="button" class="mm-chip" :class="{'is-on': filtros.preset === p.id}" :aria-pressed="filtros.preset === p.id" @click="elegirPreset(p.id)">{{ p.etiqueta }}</button>
          </div>
          <div class="grid g2" style="gap: 10px; margin-top: 6px">
            <label class="mm-input"><MmIcon i="calendar" :s="18" /><input type="date" :value="desdeTexto" aria-label="Desde" @input="editarFecha('desde', $event.target.value)" /></label>
            <label class="mm-input"><MmIcon i="calendar" :s="18" /><input type="date" :value="hastaTexto" aria-label="Hasta" @input="editarFecha('hasta', $event.target.value)" /></label>
          </div>
        </div>

        <!-- Tipo -->
        <div class="mm-field">
          <span class="mm-flabel">Tipo</span>
          <div class="mm-seg typed" role="group" aria-label="Tipo de movimiento" :style="{'--n': 3, '--on': indiceTipo, width: '100%'}" :class="{'sin-seleccion': !filtros.tipo}">
            <i class="thumb"></i>
            <button v-for="t in TIPOS" :key="t" type="button" :class="{'is-on': filtros.tipo === t}" :aria-pressed="filtros.tipo === t" @click="elegirTipo(t)">
              <MmIcon :i="TIPOS_MOVIMIENTO[t].icono" :s="14" />{{ etiquetaTipo[t] }}
            </button>
          </div>
        </div>

        <!-- Cuentas -->
        <div class="mm-field">
          <span class="mm-flabel">Cuentas</span>
          <p v-if="!listaCuentas.length" class="t-sm muted">Aún no tienes cuentas.</p>
          <div class="col" style="gap: 4px">
            <label v-for="c in listaCuentas" :key="c.id" class="mm-row" style="margin: 0; cursor: pointer">
              <input type="checkbox" class="mm-sr-only" :checked="filtros.cuentas.includes(c.id)" @change="alternarEn(filtros.cuentas, c.id)" />
              <span class="mm-check" :class="{'is-on': filtros.cuentas.includes(c.id)}"><MmIcon v-if="filtros.cuentas.includes(c.id)" i="checkmark" :s="14" /></span>
              <span class="mm-ico cat sm" :style="{width: '28px', height: '28px', borderRadius: '8px', background: tipoDe(c).color}"><MmIcon :i="tipoDe(c).icono" :s="14" /></span>
              <span class="grow t ellipsis">{{ c.nombre }}</span>
              <span class="s">{{ c.cantidad }}</span>
            </label>
          </div>
        </div>

        <!-- Categorías -->
        <div class="mm-field">
          <span class="mm-flabel">Categorías</span>
          <p v-if="!listaCategorias.length" class="t-sm muted">Se mostrarán las categorías de tus movimientos.</p>
          <div class="row" style="flex-wrap: wrap; gap: 8px">
            <button v-for="c in listaCategorias" :key="c.id" type="button" class="mm-chip" :class="{'is-on': filtros.categorias.includes(c.id)}" :aria-pressed="filtros.categorias.includes(c.id)" @click="alternarEn(filtros.categorias, c.id)">
              <i class="mm-dot" :style="{background: c.color || 'var(--cat-slate)'}"></i>{{ c.nombre }}
            </button>
          </div>
        </div>

        <!-- Monto -->
        <div class="mm-field">
          <div class="row between"><span class="mm-flabel">Monto</span><span class="t-sm muted num">{{ resumenMonto }}</span></div>
          <div class="grid g2" style="gap: 10px">
            <label class="mm-input"><span class="muted">Mín.</span><input type="number" min="0" inputmode="numeric" placeholder="0" :value="filtros.montoMin" aria-label="Monto mínimo" @input="filtros.montoMin = comoNumero($event.target.value)" /></label>
            <label class="mm-input"><span class="muted">Máx.</span><input type="number" min="0" inputmode="numeric" placeholder="Sin tope" :value="filtros.montoMax" aria-label="Monto máximo" @input="filtros.montoMax = comoNumero($event.target.value)" /></label>
          </div>
        </div>
      </div>

      <div class="mm-modal-f" style="align-items: center">
        <button type="button" class="mm-btn ghost" @click="limpiarFiltros">Limpiar</button>
        <span class="grow"></span>
        <button type="button" class="mm-btn primary" @click="cerrar">Ver {{ total }} {{ total === 1 ? "movimiento" : "movimientos" }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sin-seleccion :deep(.thumb) {
  opacity: 0;
}
.mm-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
.mm-row:has(.mm-sr-only:focus-visible) .mm-check {
  outline: 2px solid var(--brand-strong);
  outline-offset: 2px;
}
</style>
