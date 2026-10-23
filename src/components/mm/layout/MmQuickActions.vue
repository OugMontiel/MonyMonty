<script setup>
/**
 * Botón flotante con acciones rápidas. Abre los modales que ya existían
 * (nuevo movimiento, cuenta y categoría). En móvil el "+" de la barra inferior lo reemplaza.
 */
import {useAppUi} from "@/composables/useAppUi.js";
import MmIcon from "../MmIcon.vue";

const {accionesRapidasAbiertas, nuevoMovimiento, nuevaCuenta, nuevaCategoria} = useAppUi();

const ACCIONES = [
  {titulo: "Nueva cuenta", detalle: "Banco, efectivo o cooperativa", icono: "wallet", tono: "info", ejecutar: nuevaCuenta},
  {titulo: "Nueva categoría", detalle: "Con icono y color", icono: "pricetags", tono: "balance", ejecutar: nuevaCategoria},
  {titulo: "Nuevo movimiento", detalle: "Gasto, ingreso o transferencia · N", icono: "add", principal: true, ejecutar: nuevoMovimiento},
];
</script>

<template>
  <div>
    <template v-if="accionesRapidasAbiertas">
      <div class="mm-overlay" style="backdrop-filter: blur(2px); background: color-mix(in srgb, var(--overlay) 60%, transparent)" @click="accionesRapidasAbiertas = false" @keydown.esc="accionesRapidasAbiertas = false"></div>
      <div style="position: fixed; right: 32px; bottom: 108px; z-index: 25; display: flex; flex-direction: column; align-items: flex-end; gap: 12px" role="menu" aria-label="Acciones rápidas">
        <button
          v-for="(a, k) in ACCIONES"
          :key="a.titulo"
          type="button"
          role="menuitem"
          class="row gap-3 mm-rise"
          :style="{'--i': ACCIONES.length - 1 - k, border: 0, background: 'none', padding: 0, color: 'inherit', textAlign: 'right'}"
          @click="a.ejecutar"
        >
          <span class="mm-card" :style="{padding: '8px 14px', borderRadius: '12px', boxShadow: 'var(--shadow-md)', borderColor: a.principal ? 'var(--brand-strong)' : null}">
            <b class="t-label">{{ a.titulo }}</b><span class="t-xs muted" style="display: block">{{ a.detalle }}</span>
          </span>
          <span
            class="mm-ico"
            :class="a.tono"
            :style="a.principal ? {width: '48px', height: '48px', borderRadius: '16px', background: 'var(--brand-strong)', color: 'var(--on-brand)', boxShadow: 'var(--shadow-brand)'} : {width: '48px', height: '48px', borderRadius: '16px', boxShadow: 'var(--shadow-md)'}"
          >
            <MmIcon :i="a.icono" :s="a.principal ? 24 : 22" />
          </span>
        </button>
      </div>
    </template>

    <button
      type="button"
      class="mm-fab"
      :aria-label="accionesRapidasAbiertas ? 'Cerrar acciones rápidas' : 'Acciones rápidas'"
      :aria-expanded="accionesRapidasAbiertas"
      :style="accionesRapidasAbiertas ? {zIndex: 26, background: 'var(--ink)', color: 'var(--bg)', boxShadow: 'var(--shadow-lg)'} : null"
      @click="accionesRapidasAbiertas = !accionesRapidasAbiertas"
    >
      <MmIcon :i="accionesRapidasAbiertas ? 'close' : 'add'" :s="30" />
    </button>
  </div>
</template>
