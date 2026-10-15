<script setup>
/**
 * Búsqueda global (Ctrl K). Busca en los movimientos ya cargados por el tablero
 * (concepto, categoría, cuenta o monto) y ofrece acciones rápidas. Operadores de monto:
 * ">100000" y "<50000"; palabras de fecha: "hoy" y "ayer".
 */
import {ref, computed, watch, nextTick} from "vue";

import {useAppUi} from "@/composables/useAppUi.js";
import {useTablero} from "@/features/dashBoard/logic/useTablero.js";
import {describirMovimiento, fechaCorta, iconoDe, montoConSigno} from "@/features/dashBoard/logic/formato.js";
import MmIcon from "../MmIcon.vue";

const {busquedaAbierta, abrirMovimiento, nuevoMovimiento, nuevaCuenta, nuevaCategoria} = useAppUi();
const {movimientos} = useTablero();

const MAX_RESULTADOS = 6;

const texto = ref("");
const entrada = ref(null);
const seleccion = ref(0);

const sinTildes = (t) => String(t ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function mismoDia(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const resultados = computed(() => {
  const q = texto.value.trim();
  if (!q) return [];

  const op = /^([<>])\s*([\d.,]+)$/.exec(q);
  if (op) {
    const limite = Number(op[2].replace(/[.,]/g, ""));
    return movimientos.value.filter((m) => (op[1] === ">" ? m.monto > limite : m.monto < limite)).slice(0, MAX_RESULTADOS);
  }

  const clave = sinTildes(q);
  if (clave === "hoy" || clave === "ayer") {
    const dia = new Date();
    if (clave === "ayer") dia.setDate(dia.getDate() - 1);
    return movimientos.value.filter((m) => mismoDia(new Date(m.fecha), dia)).slice(0, MAX_RESULTADOS);
  }

  return movimientos.value
    .filter((m) => {
      const {titulo, detalle} = describirMovimiento(m);
      const paja = sinTildes([titulo, detalle, m.concepto?.detalle, m.subcategoria?.subcategoria, String(m.monto)].join(" "));
      return paja.includes(clave);
    })
    .slice(0, MAX_RESULTADOS);
});

const ACCIONES = [
  {id: "mov", titulo: "Registrar un movimiento", icono: "add", tono: "expense", atajo: "N", ejecutar: nuevoMovimiento},
  {id: "cuenta", titulo: "Crear una cuenta", icono: "wallet", tono: "info", ejecutar: nuevaCuenta},
  {id: "cat", titulo: "Crear una categoría", icono: "pricetags", tono: "balance", ejecutar: nuevaCategoria},
];

// Lista navegable con ↑ ↓: primero los resultados y luego las acciones
const filas = computed(() => [
  ...resultados.value.map((m) => ({tipo: "mov", mov: m})),
  ...ACCIONES.map((a) => ({tipo: "accion", accion: a})),
]);

function cerrar() {
  busquedaAbierta.value = false;
}

function activar(fila) {
  cerrar();
  if (fila.tipo === "mov") abrirMovimiento(fila.mov._id, "VIEW");
  else fila.accion.ejecutar();
}

function alTeclear(e) {
  if (e.key === "Escape") return cerrar();
  if (e.key === "ArrowDown") {
    e.preventDefault();
    seleccion.value = (seleccion.value + 1) % filas.value.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    seleccion.value = (seleccion.value - 1 + filas.value.length) % filas.value.length;
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (filas.value[seleccion.value]) activar(filas.value[seleccion.value]);
  }
}

watch(texto, () => (seleccion.value = 0));
watch(busquedaAbierta, async (abierta) => {
  if (!abierta) return;
  texto.value = "";
  seleccion.value = 0;
  await nextTick();
  entrada.value?.focus();
});

/** Parte el título en [{texto, marca}] para resaltar lo buscado sin usar v-html */
function partes(titulo) {
  const q = texto.value.trim();
  if (!q || /^[<>]/.test(q)) return [{texto: titulo, marca: false}];
  const i = sinTildes(titulo).indexOf(sinTildes(q));
  if (i < 0) return [{texto: titulo, marca: false}];
  return [
    {texto: titulo.slice(0, i), marca: false},
    {texto: titulo.slice(i, i + q.length), marca: true},
    {texto: titulo.slice(i + q.length), marca: false},
  ].filter((p) => p.texto);
}
</script>

<template>
  <div v-if="busquedaAbierta" class="mm-root" data-theme="light">
    <div class="mm-overlay top" @click.self="cerrar">
      <div class="mm-modal" role="dialog" aria-modal="true" aria-label="Buscar en MonyMonty" style="width: min(640px, 100%)" @keydown="alTeclear">
        <div class="row gap-3" style="padding: 18px 20px; border-bottom: 1px solid var(--line)">
          <span class="muted"><MmIcon i="search" :s="22" /></span>
          <input
            ref="entrada"
            v-model="texto"
            class="grow"
            aria-label="Buscar"
            placeholder="Busca un movimiento, categoría o cuenta"
            style="all: unset; flex: 1; font-size: 18px; font-weight: 600"
          />
          <span class="mm-kbd">Esc</span>
        </div>

        <div style="padding: 10px; display: flex; flex-direction: column; gap: 2px; max-height: 60vh; overflow: auto" role="listbox">
          <template v-if="texto.trim()">
            <div class="t-over" style="padding: 8px 12px 4px">Movimientos · {{ resultados.length }} {{ resultados.length === 1 ? "resultado" : "resultados" }}</div>
            <div v-if="!resultados.length" class="t-sm muted" style="padding: 8px 12px 12px">Nada coincide con “{{ texto.trim() }}”.</div>
            <button
              v-for="(m, k) in resultados"
              :key="m._id"
              type="button"
              role="option"
              :aria-selected="seleccion === k"
              class="mm-menu-item mm-rise"
              :class="{'is-on': seleccion === k}"
              :style="{'--i': k + 1, width: '100%', border: 0, background: seleccion === k ? 'var(--surface-2)' : 'none', textAlign: 'left'}"
              @mouseenter="seleccion = k"
              @click="activar({tipo: 'mov', mov: m})"
            >
              <div class="mm-ico cat sm" :style="{background: m.categoria?.color || 'var(--cat-slate)'}"><MmIcon :i="m.tipo === 'TRANSFERENCIA' ? 'swap-horizontal' : iconoDe(m.categoria?.icono)" :s="18" /></div>
              <div class="grow">
                <div>
                  <template v-for="(p, i) in partes(describirMovimiento(m).titulo)" :key="i">
                    <b v-if="p.marca" style="background: var(--brand-tint); color: var(--brand-ink); border-radius: 4px; padding: 0 2px">{{ p.texto }}</b>
                    <template v-else>{{ p.texto }}</template>
                  </template>
                </div>
                <div class="t-xs muted">{{ fechaCorta(m.fecha) }} · {{ describirMovimiento(m).detalle }}</div>
              </div>
              <span class="t-amt">{{ montoConSigno(m) }}</span>
            </button>
          </template>

          <div class="t-over" style="padding: 12px 12px 4px">Acciones rápidas</div>
          <button
            v-for="(a, k) in ACCIONES"
            :key="a.id"
            type="button"
            role="option"
            :aria-selected="seleccion === resultados.length + k"
            class="mm-menu-item"
            :style="{width: '100%', border: 0, background: seleccion === resultados.length + k ? 'var(--surface-2)' : 'none', textAlign: 'left'}"
            @mouseenter="seleccion = resultados.length + k"
            @click="activar({tipo: 'accion', accion: a})"
          >
            <div class="mm-ico sm" :class="a.tono"><MmIcon :i="a.icono" :s="18" /></div>
            <span class="grow">{{ a.titulo }}</span>
            <span v-if="a.atajo" class="mm-kbd">{{ a.atajo }}</span>
          </button>
        </div>

        <div class="row gap-4 t-xs muted" style="padding: 12px 20px; border-top: 1px solid var(--line); background: var(--surface-2); flex-wrap: wrap">
          <span class="row gap-1"><span class="mm-kbd">↑</span><span class="mm-kbd">↓</span>moverse</span>
          <span class="row gap-1 grow"><span class="mm-kbd">↵</span>abrir</span>
          <span>Busca por texto, monto o fecha: “&gt;100000”, “ayer”</span>
        </div>
      </div>
    </div>
  </div>
</template>
