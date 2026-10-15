<script setup>
/**
 * Selector desplegable con el diseño de MonyMonty (reemplaza al <select> nativo, cuyo menú no se puede
 * estilizar). Accesible: rol combobox/listbox, flechas, Enter, Escape y escritura para saltar a una opción.
 * El menú se dibuja en <body> con posición fija para que ningún modal con scroll lo recorte.
 */
import {ref, computed, watch, nextTick, onBeforeUnmount, useId} from "vue";

import MmIcon from "./MmIcon.vue";

const props = defineProps({
  modelValue: {type: [String, Number], default: ""},
  // [{value, label, detalle?, icono?, color?}]
  options: {type: Array, default: () => []},
  placeholder: {type: String, default: "Elige una opción"},
  // Icono que se muestra en el botón cuando la opción elegida no trae uno propio
  icono: {type: String, default: ""},
  invalid: {type: Boolean, default: false},
  disabled: {type: Boolean, default: false},
  // "campo" (caja completa), "pildora" (dentro de un monto) o "plano" (sin caja, dentro de una tarjeta)
  variante: {type: String, default: "campo"},
  id: {type: String, default: undefined},
  ariaLabel: {type: String, default: undefined},
});
const emit = defineEmits(["update:modelValue", "change"]);

const uid = useId();
const idLista = `sel-${uid}`;
const boton = ref(null);
const lista = ref(null);
const abierto = ref(false);
const activo = ref(-1);
const posicion = ref({});
let busqueda = "";
let temporizador = null;

const seleccion = computed(() => props.options.find((o) => o.value === props.modelValue) ?? null);

function calcularPosicion() {
  const r = boton.value.getBoundingClientRect();
  const alto = Math.min(props.options.length * 44 + 12, 280);
  const abajo = window.innerHeight - r.bottom
  const arriba = r.top;
  const subir = abajo < alto + 12 && arriba > abajo;
  const ancho = Math.max(r.width, props.variante === "campo" ? r.width : 220);
  posicion.value = {
    left: `${Math.max(8, Math.min(r.left, window.innerWidth - ancho - 8))}px`,
    width: `${ancho}px`,
    maxHeight: `${Math.max(120, Math.min(280, (subir ? arriba : abajo) - 16))}px`,
    ...(subir ? {bottom: `${window.innerHeight - r.top + 6}px`} : {top: `${r.bottom + 6}px`}),
  };
}

async function abrir() {
  if (props.disabled || !props.options.length) return;
  calcularPosicion();
  activo.value = Math.max(0, props.options.findIndex((o) => o.value === props.modelValue));
  abierto.value = true;
  await nextTick();
  lista.value?.querySelector(".activa")?.scrollIntoView({block: "nearest"});
}

function cerrar(devolverFoco = true) {
  abierto.value = false;
  if (devolverFoco) boton.value?.focus();
}

function elegir(o) {
  emit("update:modelValue", o.value);
  emit("change", o.value);
  cerrar();
}

function mover(delta) {
  const n = props.options.length;
  activo.value = (activo.value + delta + n) % n;
  nextTick(() => lista.value?.querySelector(".activa")?.scrollIntoView({block: "nearest"}));
}

function alTeclear(e) {
  if (!abierto.value) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      abrir();
    }
    return;
  }
  if (e.key === "ArrowDown") (e.preventDefault(), mover(1));
  else if (e.key === "ArrowUp") (e.preventDefault(), mover(-1));
  else if (e.key === "Home") (e.preventDefault(), (activo.value = 0));
  else if (e.key === "End") (e.preventDefault(), (activo.value = props.options.length - 1));
  else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (props.options[activo.value]) elegir(props.options[activo.value]);
  } else if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    cerrar();
  } else if (e.key === "Tab") cerrar(false);
  else if (e.key.length === 1) {
    // Escribir salta a la primera opción que empieza con lo tecleado
    clearTimeout(temporizador);
    busqueda += e.key.toLowerCase();
    temporizador = setTimeout(() => (busqueda = ""), 700);
    const i = props.options.findIndex((o) => String(o.label).toLowerCase().startsWith(busqueda));
    if (i >= 0) activo.value = i;
  }
}

// Si la página se desplaza o cambia de tamaño con el menú abierto, la posición ya no sirve
function alCambiarVista(e) {
  if (abierto.value && !lista.value?.contains(e.target)) cerrar(false);
}
watch(abierto, (v) => {
  const f = v ? "addEventListener" : "removeEventListener";
  window[f]("resize", alCambiarVista);
  window[f]("scroll", alCambiarVista, true);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", alCambiarVista);
  window.removeEventListener("scroll", alCambiarVista, true);
  clearTimeout(temporizador);
});
</script>

<template>
  <div class="mm-select-raiz" :class="`v-${variante}`">
    <button
      :id="id"
      ref="boton"
      type="button"
      class="mm-sel"
      :class="[variante === 'campo' ? 'mm-input' : '', {'is-error': invalid, 'is-focus': abierto, vacio: !seleccion}]"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="abierto"
      :aria-controls="idLista"
      :aria-label="ariaLabel"
      :aria-invalid="invalid || undefined"
      :disabled="disabled"
      @click="abierto ? cerrar() : abrir()"
      @keydown="alTeclear"
    >
      <span v-if="seleccion?.color || seleccion?.icono || icono" class="mm-ico cat sel-icono" :style="seleccion?.color ? {background: seleccion.color} : {background: 'transparent', color: 'var(--ink-subtle)'}">
        <MmIcon :i="seleccion?.icono || icono || 'pricetags'" :s="variante === 'campo' ? 14 : 16" />
      </span>
      <span class="sel-texto">{{ seleccion ? (variante === "pildora" ? seleccion.corto ?? seleccion.label : seleccion.label) : placeholder }}</span>
      <MmIcon i="chevron-down" :s="variante === 'pildora' ? 12 : 16" class="sel-flecha" :class="{girada: abierto}" />
    </button>

    <Teleport to="body">
      <div v-if="abierto" class="mm-root capa-select" data-theme="light" @mousedown.self="cerrar(false)">
        <div :id="idLista" ref="lista" class="mm-popover sel-lista" role="listbox" :aria-label="ariaLabel" :style="posicion">
          <div
            v-for="(o, i) in options"
            :key="o.value"
            class="mm-menu-item sel-opcion"
            :class="{activa: i === activo, elegida: o.value === modelValue}"
            role="option"
            :aria-selected="o.value === modelValue"
            @mouseenter="activo = i"
            @mousedown.prevent
            @click="elegir(o)"
          >
            <span v-if="o.color || o.icono" class="mm-ico cat" :style="{width: '26px', height: '26px', borderRadius: '8px', background: o.color || 'var(--surface-3)', color: o.color ? '#fff' : 'var(--ink-muted)'}"><MmIcon :i="o.icono || 'pricetags'" :s="14" /></span>
            <span class="grow" style="min-width: 0">
              <span class="ellipsis" style="display: block">{{ o.label }}</span>
              <span v-if="o.detalle" class="t-xs muted ellipsis" style="display: block">{{ o.detalle }}</span>
            </span>
            <MmIcon v-if="o.value === modelValue" i="checkmark" :s="16" class="sel-check" />
          </div>
          <div v-if="!options.length" class="t-sm muted" style="padding: 10px 12px">Sin opciones</div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.mm-select-raiz {
  min-width: 0;
  display: flex;
}
.mm-sel {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  flex: 1;
  width: 100%;
  text-align: left;
  font: inherit;
  color: var(--ink);
  cursor: pointer;
}
.mm-sel:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.mm-sel.vacio .sel-texto {
  color: var(--ink-muted);
}
.sel-texto {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.sel-icono {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  flex: none;
}
.sel-flecha {
  flex: none;
  color: var(--ink-subtle);
  transition: transform var(--dur-fast);
}
.sel-flecha.girada {
  transform: rotate(180deg);
}

/* Dentro de un campo de monto: una pastilla con el código de la divisa */
.v-pildora .mm-sel {
  flex: none;
  width: auto;
  gap: 4px;
  border: 0;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--surface-3);
  font-size: 12px;
  font-weight: 800;
}
.v-pildora .mm-sel:hover,
.v-pildora .mm-sel.is-focus {
  background: var(--brand-tint);
  color: var(--brand-ink);
}
.v-pildora {
  width: auto;
}

/* Dentro de una tarjeta Desde / Hacia: sin caja, solo el texto en negrita */
.v-plano .mm-sel {
  border: 0;
  background: none;
  padding: 0;
  height: 28px;
  font-weight: 700;
  font-size: 14px;
  border-radius: 8px;
}
.v-plano .mm-sel:hover .sel-flecha,
.v-plano .mm-sel.is-focus .sel-flecha {
  color: var(--ink);
}

/* Capa del menú: transparente, sin tapar la página, y por encima de los modales */
.capa-select {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: transparent !important;
  min-height: 0 !important;
}
.sel-lista {
  position: fixed;
  overflow-y: auto;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 91;
}
.sel-opcion {
  cursor: pointer;
  border-radius: 10px;
  padding: 8px 10px;
}
.sel-opcion.activa {
  background: var(--surface-2);
}
.sel-opcion.elegida {
  color: var(--brand-ink);
  font-weight: 700;
}
.sel-check {
  color: var(--brand-strong);
}
</style>
