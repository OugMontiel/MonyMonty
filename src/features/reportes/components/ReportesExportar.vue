<script setup>
/**
 * Exportar reportes: descarga en CSV los movimientos o el resumen por mes del periodo elegido.
 * Se arma en el navegador con los datos ya cargados (la API no tiene endpoint de exportación).
 */
import {ref, computed, onMounted} from "vue";

import MmIcon from "@/components/mm/MmIcon.vue";
import {useAvisos} from "@/composables/useAvisos.js";
import {describirMovimiento, cuentaDeMovimiento} from "@/features/dashBoard/logic/formato.js";
import {delAnio, delMes, mesesDelAnio} from "../logic/calculos.js";
import {useReportes} from "../logic/useReportes.js";

const {anio, mes, movimientos, etiquetaMes, exportarAbierto} = useReportes();
const {mostrar} = useAvisos();

const alcance = ref("mes"); // mes | anio | todo
const contenido = ref("movimientos"); // movimientos | resumen

const ALCANCES = computed(() => [
  {id: "mes", titulo: etiquetaMes.value, texto: "Solo el mes que estás viendo"},
  {id: "anio", titulo: `Todo ${anio.value}`, texto: "Enero a diciembre del año que estás viendo"},
  {id: "todo", titulo: "Todo el historial", texto: "Todos tus movimientos registrados"},
]);
const CONTENIDOS = [
  {id: "movimientos", titulo: "Movimientos", texto: "Una fila por movimiento, con categoría y cuenta"},
  {id: "resumen", titulo: "Resumen por mes", texto: "Ingresos, gastos, ahorro y tasa de cada mes del año"},
];

const panel = ref(null);
onMounted(() => panel.value?.focus());

const celda = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

function descargar(nombre, filas) {
  // BOM para que Excel reconozca los acentos
  const blob = new Blob(["﻿" + filas.map((f) => f.map(celda).join(",")).join("\r\n")], {type: "text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

function exportar() {
  let nombre;
  let filas;
  if (contenido.value === "resumen") {
    filas = [["Mes", "Ingresos", "Gastos", "Ahorro", "Tasa de ahorro (%)"]];
    for (const m of mesesDelAnio(movimientos.value, anio.value, 11).filter((x) => x.cantidad > 0)) filas.push([`${m.nombre} ${anio.value}`, m.ingresos, m.gastos, m.ahorro, m.tasa ?? ""]);
    nombre = `reporte-resumen-${anio.value}.csv`;
  } else {
    const lista = alcance.value === "mes" ? delMes(movimientos.value, anio.value, mes.value) : alcance.value === "anio" ? delAnio(movimientos.value, anio.value) : movimientos.value;
    filas = [["Fecha", "Tipo", "Título", "Categoría", "Subcategoría", "Cuenta", "Monto", "Divisa"]];
    for (const m of lista) {
      filas.push([new Date(m.fecha).toISOString(), m.tipo, describirMovimiento(m).titulo, m.categoria?.categoria ?? "", m.subcategoria?.subcategoria ?? "", cuentaDeMovimiento(m), m.monto, m.divisaId]);
    }
    nombre = `movimientos-${alcance.value === "mes" ? `${anio.value}-${String(mes.value + 1).padStart(2, "0")}` : alcance.value === "anio" ? anio.value : "historial"}.csv`;
  }
  descargar(nombre, filas);
  exportarAbierto.value = false;
  mostrar({titulo: "Reporte descargado", detalle: `${filas.length - 1} ${filas.length - 1 === 1 ? "fila" : "filas"} en ${nombre}`});
}
</script>

<template>
  <div class="mm-root" data-theme="light">
    <div class="mm-overlay" @click.self="exportarAbierto = false">
      <div ref="panel" class="mm-modal sm" role="dialog" aria-modal="true" aria-labelledby="exportar-titulo" tabindex="-1" style="outline: 0" @keydown.esc="exportarAbierto = false">
        <div class="mm-modal-h">
          <div class="grow"><h2 id="exportar-titulo" class="t-h2">Exportar reporte</h2><p class="t-sm muted">Se descarga en CSV, listo para abrir en Excel.</p></div>
          <button type="button" class="mm-x" aria-label="Cerrar" @click="exportarAbierto = false"><MmIcon i="close" :s="20" /></button>
        </div>
        <div class="mm-modal-b">
          <fieldset class="opciones">
            <legend class="t-over">Qué descargar</legend>
            <button v-for="c in CONTENIDOS" :key="c.id" type="button" class="opcion" :class="{on: contenido === c.id}" :aria-pressed="contenido === c.id" @click="contenido = c.id"><b>{{ c.titulo }}</b><span class="t-xs muted">{{ c.texto }}</span></button>
          </fieldset>
          <fieldset v-if="contenido === 'movimientos'" class="opciones">
            <legend class="t-over">Periodo</legend>
            <button v-for="a in ALCANCES" :key="a.id" type="button" class="opcion" :class="{on: alcance === a.id}" :aria-pressed="alcance === a.id" @click="alcance = a.id"><b>{{ a.titulo }}</b><span class="t-xs muted">{{ a.texto }}</span></button>
          </fieldset>
        </div>
        <div class="mm-modal-f">
          <button type="button" class="mm-btn" @click="exportarAbierto = false">Cancelar</button>
          <button type="button" class="mm-btn primary" @click="exportar"><MmIcon i="download" :s="18" />Descargar CSV</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.opciones {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 0;
  padding: 0;
  margin: 0;
}
.opcion {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1.5px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.opcion.on {
  border-color: var(--brand);
  background: var(--surface-2);
}
</style>
