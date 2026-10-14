<script setup>
/**
 * Últimos movimientos (S17). Cada fila abre el movimiento en el modal existente (ver);
 * al pasar el cursor aparecen editar y eliminar para no perder lo que ya permitía el tablero anterior.
 */
import {useAppUi} from "@/composables/useAppUi.js";
import {useTablero, tabRecientes} from "../../logic/useTablero.js";
import {describirMovimiento, fechaCorta, iconoDe, montoConSigno} from "../../logic/formato.js";
import MmIcon from "@/components/mm/MmIcon.vue";

const {recientes, cargandoRecientes, cargarRecientes} = useTablero();
const {abrirMovimiento} = useAppUi();

const TABS = [
  {id: "TODOS", etiqueta: "Todos"},
  {id: "INGRESO", etiqueta: "Ingresos"},
  {id: "EGRESO", etiqueta: "Gastos"},
  {id: "TRANSFERENCIA", etiqueta: "Transferencias"},
];

function cambiarTab(id) {
  if (tabRecientes.value === id) return;
  tabRecientes.value = id;
  cargarRecientes();
}

const claseMonto = (m) => (m.tipo === "INGRESO" ? "income" : m.tipo === "TRANSFERENCIA" ? "info" : "");
const colorIcono = (m) => (m.tipo === "TRANSFERENCIA" ? "var(--cat-sky)" : m.categoria?.color || "var(--cat-slate)");
const icono = (m) => (m.tipo === "TRANSFERENCIA" ? "swap-horizontal" : iconoDe(m.categoria?.icono));
</script>

<template>
  <div>
    <div class="mm-tabs" role="tablist" aria-label="Tipo de movimiento">
      <button v-for="t in TABS" :key="t.id" type="button" role="tab" :aria-selected="tabRecientes === t.id" :class="{'is-on': tabRecientes === t.id}" @click="cambiarTab(t.id)">{{ t.etiqueta }}</button>
    </div>

    <div class="mm-list" style="margin-top: 8px" :aria-busy="cargandoRecientes">
      <template v-if="cargandoRecientes && !recientes.length">
        <div v-for="n in 4" :key="n" class="row gap-3" style="padding: 10px 0">
          <div class="mm-skel" style="width: 34px; height: 34px; border-radius: 10px"></div>
          <div class="col grow"><div class="mm-skel" style="width: 50%; height: 14px"></div><div class="mm-skel" style="width: 30%; height: 11px"></div></div>
          <div class="mm-skel" style="width: 90px; height: 16px"></div>
        </div>
      </template>

      <div v-if="!cargandoRecientes && !recientes.length" class="mm-empty" style="padding: 24px 8px">
        <p class="t-sm muted">No hay movimientos de este tipo todavía.</p>
      </div>

      <div v-for="(m, k) in recientes" :key="m._id" class="mm-row mm-rise fila" :style="{'--i': k + 1}">
        <button type="button" class="fila-principal" @click="abrirMovimiento(m._id, 'VIEW')">
          <span class="mm-ico cat sm" :style="{background: colorIcono(m)}"><MmIcon :i="icono(m)" :s="18" /></span>
          <span class="grow" style="min-width: 0">
            <span class="t ellipsis" style="display: block">{{ describirMovimiento(m).titulo }}</span>
            <span class="s ellipsis" style="display: block">{{ describirMovimiento(m).detalle }}</span>
          </span>
          <span style="text-align: right">
            <span class="t-amt" :class="claseMonto(m)">{{ montoConSigno(m) }}</span>
            <span class="s" style="display: block">{{ fechaCorta(m.fecha) }}</span>
          </span>
        </button>
        <span v-if="!m.esSistema" class="fila-acciones">
          <button type="button" class="mm-btn icon sm ghost" aria-label="Editar movimiento" @click="abrirMovimiento(m._id, 'EDIT')"><MmIcon i="create" :s="16" /></button>
          <button type="button" class="mm-btn icon sm ghost" aria-label="Eliminar movimiento" @click="abrirMovimiento(m._id, 'DELETE')"><MmIcon i="trash" :s="16" /></button>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fila {
  gap: 4px;
}
.fila-principal {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border: 0;
  background: none;
  padding: 0;
  text-align: left;
  color: inherit;
}
.fila-acciones {
  display: flex;
  opacity: 0;
  transition: opacity var(--dur-fast);
}
/* En pantallas táctiles no hay hover: las acciones se quedan visibles */
.fila:hover .fila-acciones,
.fila:focus-within .fila-acciones {
  opacity: 1;
}
@media (hover: none) {
  .fila-acciones {
    opacity: 1;
  }
}
</style>
