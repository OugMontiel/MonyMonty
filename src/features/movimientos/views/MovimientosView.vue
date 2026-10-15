<script setup>
/**
 * Movimientos: todo lo que entra, sale y se mueve entre las cuentas. Lista agrupada por día con
 * totales del periodo, búsqueda, filtro por tipo y exportación a CSV. Usa los datos que entrega
 * POST movimiento/list (campos tipo, monto, fecha, concepto, categoria, entidad…).
 */
import {ref, computed, onMounted, watch} from "vue";

import {useGlobalState} from "@/composables/useGlobalState";
import {useAppUi} from "@/composables/useAppUi.js";
import MmIcon from "@/components/mm/MmIcon.vue";
import MmTopbar from "@/components/mm/layout/MmTopbar.vue";
import {periodo} from "@/features/dashBoard/logic/useTablero.js";
import {
  describirMovimiento,
  horaCorta,
  moneda,
  montoConSigno,
  tituloDia,
  TIPOS_MOVIMIENTO,
  colorMovimiento,
  iconoMovimiento,
  cuentaDeMovimiento,
} from "@/features/dashBoard/logic/formato.js";
import {movimientos, movimientosSinCargar, movimientoResaltado, ultimoGuardado, cargarTodosLosMovimientos, cargarEntidades} from "../logic/movimientosStore.js";
import {filtros, aplicarFiltros, filtrosActivos, limpiarFiltros} from "../logic/filtrosMovimientos.js";
import FiltrosMovimientos from "../components/FiltrosMovimientos.vue";
import ImportarMovimientos from "../components/ImportarMovimientos.vue";

const {abrirMovimiento} = useAppUi();
const {globalDataRefreshTrigger} = useGlobalState();

const POR_PAGINA = 20;
const panelFiltros = ref(false);
const importando = ref(false);
const cargando = ref(movimientosSinCargar.value);
const error = ref("");
const pagina = ref(1);

async function cargar() {
  error.value = "";
  try {
    await Promise.all([cargarTodosLosMovimientos(), cargarEntidades()]);
  } catch (err) {
    error.value = err.response?.data?.message || "No pudimos cargar tus movimientos. Revisa tu conexión e inténtalo de nuevo.";
  } finally {
    cargando.value = false;
  }
}

onMounted(cargar);
watch(globalDataRefreshTrigger, cargar);

// ---------- Datos filtrados ----------
const divisa = computed(() => movimientos.value.find((m) => m.divisaId)?.divisaId ?? "COP");
const dinero = (v) => moneda(v, divisa.value);

// El tipo se cuenta sin aplicar el propio filtro de tipo, para que cada chip muestre cuántos habría
const base = computed(() => aplicarFiltros(movimientos.value, {ignorar: ["tipo"]}));
const lista = computed(() => (filtros.tipo ? base.value.filter((m) => m.tipo === filtros.tipo) : base.value));
const cuenta = (tipo) => base.value.filter((m) => m.tipo === tipo).length;

const totales = computed(() => {
  // El saldo inicial de una cuenta no es plata que "entró" en el periodo
  const suma = (tipo) => lista.value.filter((m) => m.tipo === tipo && !m.esSistema).reduce((s, m) => s + m.monto, 0);
  const entro = suma("INGRESO");
  const salio = suma("EGRESO");
  return {entro, salio, movio: suma("TRANSFERENCIA"), balance: entro - salio};
});

/** Estilo de una tarjeta de totales cuando el último movimiento guardado la afecta */
const cambiada = (tipo) => ultimoGuardado.value?.tipo === tipo;
const estiloCambiada = (tono) => ({position: "relative", borderColor: `var(--${tono})`, boxShadow: `0 0 0 4px var(--${tono}-tint)`, transition: "box-shadow var(--dur-slow)"});

const totalPaginas = computed(() => Math.max(1, Math.ceil(lista.value.length / POR_PAGINA)));
const visibles = computed(() => lista.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA));

// Agrupa las filas visibles por día
const grupos = computed(() => {
  const mapa = new Map();
  for (const m of visibles.value) {
    const f = new Date(m.fecha);
    const clave = `${f.getFullYear()}-${f.getMonth()}-${f.getDate()}`;
    if (!mapa.has(clave)) mapa.set(clave, {clave, titulo: tituloDia(f), items: []});
    mapa.get(clave).items.push(m);
  }
  return [...mapa.values()];
});

// Al cambiar cualquier filtro se vuelve a la primera página
watch(
  () => [filtros.texto, filtros.tipo, filtros.preset, filtros.desde, filtros.hasta, filtros.cuentas.length, filtros.categorias.length, filtros.montoMin, filtros.montoMax, periodo.value],
  () => (pagina.value = 1)
);
watch(totalPaginas, (n) => {
  if (pagina.value > n) pagina.value = n;
});

/** 1 2 3 … 8, con la página actual en el centro cuando hay muchas */
const botonesPagina = computed(() => {
  const n = totalPaginas.value;
  const p = pagina.value;
  if (n <= 7) return Array.from({length: n}, (_, i) => i + 1);
  const set = new Set([1, 2, n - 1, n, p - 1, p, p + 1].filter((x) => x >= 1 && x <= n));
  const orden = [...set].sort((a, b) => a - b);
  return orden.flatMap((x, i) => (i && x - orden[i - 1] > 1 ? ["…", x] : [x]));
});

const TIPOS = [
  {id: null, etiqueta: "Todos", icono: null},
  {id: "EGRESO", etiqueta: "Gastos", icono: "trending-down"},
  {id: "INGRESO", etiqueta: "Ingresos", icono: "trending-up"},
  {id: "TRANSFERENCIA", etiqueta: "Transferencias", icono: "swap-horizontal"},
];

function alElegirPeriodo(p) {
  // Elegir un periodo en la barra superior deja sin efecto el rango del panel de filtros
  filtros.preset = null;
  periodo.value = p;
}

// ---------- Menú de la fila ----------
// Se dibuja con posición fija junto al botón para que la tabla (con scroll) no lo recorte
const menuFila = ref(null); // {id, esSistema, top, right}

function abrirMenu(e, m) {
  if (menuFila.value?.id === m._id) {
    menuFila.value = null;
    return;
  }
  const r = e.currentTarget.getBoundingClientRect();
  const abajo = window.innerHeight - r.bottom < 190;
  menuFila.value = {id: m._id, esSistema: Boolean(m.esSistema), top: abajo ? undefined : r.bottom + 4, bottom: abajo ? window.innerHeight - r.top + 4 : undefined, right: window.innerWidth - r.right};
}

function accion(modo) {
  const id = menuFila.value.id;
  menuFila.value = null;
  abrirMovimiento(id, modo);
}

// ---------- Exportar ----------
function exportarCSV() {
  const celda = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const filas = [["Fecha", "Tipo", "Título", "Detalle", "Categoría", "Subcategoría", "Cuenta", "Monto", "Divisa", "Referencia", "Estado"]];
  for (const m of lista.value) {
    filas.push([
      new Date(m.fecha).toISOString(),
      m.tipo,
      describirMovimiento(m).titulo,
      m.concepto?.detalle ?? "",
      m.categoria?.categoria ?? "",
      m.subcategoria?.subcategoria ?? "",
      cuentaDeMovimiento(m),
      m.monto,
      m.divisaId,
      m.referencia ?? "",
      m.estado ?? "",
    ]);
  }
  // BOM para que Excel reconozca los acentos
  const blob = new Blob(["﻿" + filas.map((f) => f.map(celda).join(",")).join("\r\n")], {type: "text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `movimientos-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="mm-page">
    <MmTopbar
      migas="Resumen"
      titulo="Movimientos"
      subtitulo="Todo lo que entra, sale y se mueve entre tus cuentas"
      cta="Nuevo movimiento"
      :periodo="filtros.preset ? '' : periodo"
      @update:periodo="alElegirPeriodo"
    />

    <div class="mm-content" :aria-busy="cargando">
      <div v-if="error" class="mm-banner expense" role="alert">
        <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ error }}</span>
        <button type="button" class="mm-btn sm" @click="cargar"><MmIcon i="refresh" :s="16" />Reintentar</button>
      </div>

      <!-- Totales del periodo -->
      <div class="grid g4">
        <div class="mm-card mm-rise" style="--i: 0" :style="cambiada('INGRESO') ? estiloCambiada('income') : null">
          <div class="row gap-3"><div class="mm-ico income sm"><MmIcon i="trending-up" :s="18" /></div><div><div class="t-over">Entró</div><div class="t-h2 num income">+ {{ dinero(totales.entro) }}</div></div><span v-if="cambiada('INGRESO')" class="mm-badge income mm-popin" style="position: absolute; top: 12px; right: 12px">+ {{ dinero(ultimoGuardado.monto) }}</span></div>
        </div>
        <div class="mm-card mm-rise" style="--i: 1" :style="cambiada('EGRESO') ? estiloCambiada('expense') : null">
          <div class="row gap-3"><div class="mm-ico expense sm"><MmIcon i="trending-down" :s="18" /></div><div><div class="t-over">Salió</div><div class="t-h2 num">− {{ dinero(totales.salio) }}</div></div><span v-if="cambiada('EGRESO')" class="mm-badge expense mm-popin" style="position: absolute; top: 12px; right: 12px">+ {{ dinero(ultimoGuardado.monto) }}</span></div>
        </div>
        <div class="mm-card mm-rise" style="--i: 2" :style="cambiada('TRANSFERENCIA') ? estiloCambiada('info') : null">
          <div class="row gap-3"><div class="mm-ico info sm"><MmIcon i="swap-horizontal" :s="18" /></div><div><div class="t-over">Se movió</div><div class="t-h2 num info">{{ dinero(totales.movio) }}</div></div><span v-if="cambiada('TRANSFERENCIA')" class="mm-badge info mm-popin" style="position: absolute; top: 12px; right: 12px">+ {{ dinero(ultimoGuardado.monto) }}</span></div>
        </div>
        <div class="mm-card mm-rise" style="--i: 3">
          <div class="row gap-3"><div class="mm-ico balance sm"><MmIcon i="wallet" :s="18" /></div><div><div class="t-over">Balance del periodo</div><div class="t-h2 num balance">{{ totales.balance < 0 ? "−" : "+" }} {{ dinero(Math.abs(totales.balance)) }}</div></div></div>
        </div>
      </div>

      <div class="mm-card pad0 mm-rise" style="--i: 4">
        <!-- Barra de herramientas -->
        <div class="row gap-3" style="padding: 16px 20px; flex-wrap: wrap; border-bottom: 1px solid var(--line)">
          <div class="mm-input" style="width: 320px; max-width: 100%; height: 42px">
            <MmIcon i="search" :s="18" />
            <input v-model="filtros.texto" placeholder="Buscar por descripción o monto" aria-label="Buscar movimientos" />
          </div>
          <div class="row gap-2 grow" style="flex-wrap: wrap" role="group" aria-label="Tipo de movimiento">
            <button v-for="t in TIPOS" :key="String(t.id)" type="button" class="mm-chip" :class="{'is-on': filtros.tipo === t.id}" :aria-pressed="filtros.tipo === t.id" @click="filtros.tipo = t.id">
              <MmIcon v-if="t.icono" :i="t.icono" :s="14" />{{ t.etiqueta }}
              <b v-if="t.id === null" class="num">{{ base.length }}</b>
              <b v-else class="num">{{ cuenta(t.id) }}</b>
            </button>
          </div>
          <button type="button" class="mm-btn" aria-haspopup="dialog" @click="panelFiltros = true">
            <MmIcon i="filter" :s="18" />Filtros<span v-if="filtrosActivos" class="mm-count">{{ filtrosActivos }}</span>
          </button>
          <button type="button" class="mm-btn" @click="importando = true"><MmIcon i="cloud-upload" :s="18" />Importar</button>
          <button type="button" class="mm-btn icon" aria-label="Exportar a CSV" title="Exportar a CSV" :disabled="!lista.length" @click="exportarCSV"><MmIcon i="download" :s="18" /></button>
        </div>

        <!-- Carga -->
        <div v-if="cargando" style="padding: 12px 20px">
          <div v-for="n in 6" :key="n" class="row gap-3" style="padding: 12px 0">
            <div class="mm-skel" style="width: 34px; height: 34px; border-radius: 10px"></div>
            <div class="col grow"><div class="mm-skel" style="width: 40%; height: 14px"></div><div class="mm-skel" style="width: 20%; height: 11px"></div></div>
            <div class="mm-skel" style="width: 90px; height: 16px"></div>
          </div>
        </div>

        <!-- Sin movimientos -->
        <div v-else-if="!movimientos.length" class="mm-empty">
          <div class="art"><div class="mm-ico lg brand mm-float" style="width: 56px; height: 56px; border-radius: 18px"><MmIcon i="swap-horizontal" :s="26" /></div></div>
          <h3 class="t-h3">Todavía no tienes movimientos</h3>
          <p class="t-sm muted" style="max-width: 320px">Registra tu primer gasto o ingreso y aparecerá aquí.</p>
        </div>

        <!-- Los filtros no dejan resultados -->
        <div v-else-if="!lista.length" class="mm-empty">
          <h3 class="t-h3">Nada coincide con estos filtros</h3>
          <p class="t-sm muted">Prueba con otro periodo o quita algún filtro.</p>
          <button type="button" class="mm-btn" @click="limpiarFiltros(); filtros.texto = ''">Limpiar filtros</button>
        </div>

        <div v-else style="overflow-x: auto">
          <table class="mm-table">
            <thead>
              <tr>
                <th>Movimiento</th><th>Categoría</th><th>Cuenta</th><th>Tipo</th><th class="r">Monto</th>
                <th style="width: 48px"><span style="position: absolute; left: -9999px">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="g in grupos" :key="g.clave">
                <tr class="mm-daygroup">
                  <td colspan="6"><span class="row between"><span>{{ g.titulo }}</span><span class="num">{{ g.items.length }} {{ g.items.length === 1 ? "movimiento" : "movimientos" }}</span></span></td>
                </tr>
                <tr v-for="m in g.items" :key="m._id" class="mm-fadein" :class="{'is-sel': movimientoResaltado === m._id}" :style="movimientoResaltado === m._id ? 'box-shadow: inset 4px 0 0 var(--brand)' : null">
                  <td>
                    <button type="button" class="celda-movimiento" @click="abrirMovimiento(m._id, 'VIEW')">
                      <span class="mm-ico cat sm" :style="{background: colorMovimiento(m)}"><MmIcon :i="iconoMovimiento(m)" :s="18" /></span>
                      <span style="min-width: 0">
                        <b class="ellipsis" style="display: block">{{ describirMovimiento(m).titulo }}</b>
                        <span class="t-xs muted">{{ horaCorta(m.fecha) }}</span>
                      </span>
                      <span v-if="movimientoResaltado === m._id" class="mm-badge brand">Nuevo</span>
                    </button>
                  </td>
                  <td>{{ m.tipo === "TRANSFERENCIA" ? "Transferencia" : m.categoria?.categoria }}</td>
                  <td class="muted">{{ cuentaDeMovimiento(m) }}</td>
                  <td>
                    <span class="mm-badge" :class="TIPOS_MOVIMIENTO[m.tipo].tono"><MmIcon :i="TIPOS_MOVIMIENTO[m.tipo].icono" :s="12" />{{ TIPOS_MOVIMIENTO[m.tipo].etiqueta }}</span>
                  </td>
                  <td class="r"><span class="t-amt" :class="TIPOS_MOVIMIENTO[m.tipo].clase">{{ montoConSigno(m) }}</span></td>
                  <td>
                    <button type="button" class="mm-btn icon sm ghost" aria-label="Más acciones" aria-haspopup="menu" :aria-expanded="menuFila?.id === m._id" @click.stop="abrirMenu($event, m)">
                      <MmIcon i="ellipsis-vertical" :s="18" />
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="lista.length" class="row between" style="padding: 14px 20px; flex-wrap: wrap; gap: 12px">
          <span class="t-sm muted">Mostrando {{ (pagina - 1) * POR_PAGINA + 1 }}–{{ Math.min(pagina * POR_PAGINA, lista.length) }} de {{ lista.length }} movimientos</span>
          <nav v-if="totalPaginas > 1" class="row gap-1" aria-label="Páginas">
            <button type="button" class="mm-btn icon sm" aria-label="Anterior" :disabled="pagina === 1" @click="pagina--"><MmIcon i="chevron-back" :s="16" /></button>
            <template v-for="(b, i) in botonesPagina" :key="`${b}-${i}`">
              <span v-if="b === '…'" class="muted">…</span>
              <button v-else type="button" class="mm-btn sm" :class="b === pagina ? 'primary' : 'ghost'" :aria-current="b === pagina ? 'page' : null" @click="pagina = b">{{ b }}</button>
            </template>
            <button type="button" class="mm-btn icon sm" aria-label="Siguiente" :disabled="pagina === totalPaginas" @click="pagina++"><MmIcon i="chevron-forward" :s="16" /></button>
          </nav>
        </div>
      </div>
    </div>

    <ImportarMovimientos v-if="importando" @cerrar="importando = false" />
    <FiltrosMovimientos v-model="panelFiltros" :total="lista.length" />

    <!-- Menú de la fila abierta; el fondo transparente lo cierra al hacer clic en cualquier otro lugar -->
    <template v-if="menuFila">
      <div style="position: fixed; inset: 0; z-index: 40" @click="menuFila = null"></div>
      <div class="mm-root" data-theme="light" style="position: fixed; inset: 0; z-index: 41; pointer-events: none; background: transparent; min-height: 0">
        <div class="mm-popover" role="menu" :style="{position: 'fixed', top: menuFila.top !== undefined ? `${menuFila.top}px` : 'auto', bottom: menuFila.bottom !== undefined ? `${menuFila.bottom}px` : 'auto', right: `${menuFila.right}px`, width: '190px', pointerEvents: 'auto'}">
          <button type="button" class="mm-menu-item" role="menuitem" @click="accion('VIEW')"><MmIcon i="document-text" :s="18" />Ver detalle</button>
          <button v-if="!menuFila.esSistema" type="button" class="mm-menu-item" role="menuitem" @click="accion('EDIT')"><MmIcon i="create" :s="18" />Editar</button>
          <button v-if="!menuFila.esSistema" type="button" class="mm-menu-item" role="menuitem" style="color: var(--expense)" @click="accion('DELETE')"><MmIcon i="trash" :s="18" />Eliminar</button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.mm-page {
  display: contents;
}
.celda-movimiento {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border: 0;
  background: none;
  padding: 0;
  text-align: left;
  color: inherit;
  max-width: 100%;
}
</style>
