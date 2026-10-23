<script setup>
/**
 * Confirmación para eliminar un movimiento (DELETE movimiento/:id). Muestra qué se va a borrar
 * y cómo quedan los saldos de las cuentas afectadas.
 */
import {ref, computed, onMounted, nextTick} from "vue";

import {useAvisos} from "@/composables/useAvisos.js";
import MmIcon from "@/components/mm/MmIcon.vue";
import {useTablero} from "@/features/dashBoard/logic/useTablero.js";
import {describirMovimiento, fechaCorta, moneda, montoConSigno, colorMovimiento, iconoMovimiento, cuentaDeMovimiento} from "@/features/dashBoard/logic/formato.js";
import {useMovimientos} from "../logic/CreateMovimiento.js";
import {movimientos} from "../logic/movimientosStore.js";

const props = defineProps({
  id: {type: String, required: true},
});
const emit = defineEmits(["cerrar", "eliminado"]);

const {mostrar} = useAvisos();
const {getMovimiento, deleteMovimiento, loading: eliminando} = useMovimientos();
const {cuentas} = useTablero();

const mov = ref(movimientos.value.find((m) => m._id === props.id) ?? null);
const cargando = ref(!mov.value);
const error = ref("");
const dialogo = ref(null);

onMounted(async () => {
  // Normalmente el movimiento ya está cargado; si no, se pide a la API
  if (!mov.value) {
    try {
      mov.value = (await getMovimiento(props.id)).data;
    } catch (err) {
      error.value = err.response?.data?.message || "No pudimos cargar este movimiento.";
    } finally {
      cargando.value = false;
    }
  }
  await nextTick();
  dialogo.value?.focus();
});

const cuentaPorId = (id) => cuentas.value.find((c) => c.id === id);

/** Saldos que quedan al borrar: se revierte el efecto del movimiento sobre cada cuenta */
const efectos = computed(() => {
  const m = mov.value;
  if (!m) return [];
  const lista = [];
  const agregar = (id, delta) => {
    const c = cuentaPorId(id);
    if (c) lista.push({nombre: c.nombre, saldo: c.saldo + delta, divisaId: c.divisaId});
  };
  if (m.tipo === "INGRESO") agregar(m.entidadId, -m.monto);
  else if (m.tipo === "EGRESO") agregar(m.entidadId, m.monto);
  else {
    agregar(m.transferencia?.origenEntidadId, m.monto);
    agregar(m.transferencia?.destinoEntidadId, -m.monto);
  }
  return lista;
});

async function eliminar() {
  try {
    await deleteMovimiento(props.id);
    mostrar({icono: "trash", tono: "info", titulo: "Movimiento eliminado", detalle: describirMovimiento(mov.value).titulo});
    emit("eliminado");
    emit("cerrar");
  } catch (err) {
    mostrar({tono: "expense", icono: "alert-circle", titulo: "No se pudo eliminar", detalle: err.response?.data?.message || "Inténtalo de nuevo."});
  }
}
</script>

<template>
  <div class="mm-root" data-theme="light">
    <div class="mm-overlay" @click.self="emit('cerrar')" @keydown.esc="emit('cerrar')">
      <div ref="dialogo" class="mm-modal sm" role="alertdialog" aria-modal="true" aria-labelledby="eliminar-titulo" aria-describedby="eliminar-desc" tabindex="-1" style="outline: 0">
        <div v-if="cargando" class="mm-modal-b" style="min-height: 240px" role="status" aria-label="Cargando el movimiento">
          <div class="mm-skel" style="width: 64px; height: 64px; border-radius: 20px; align-self: center"></div>
          <div class="mm-skel" style="width: 100%; height: 60px"></div>
        </div>

        <div v-else-if="error" class="mm-modal-b">
          <div class="mm-banner expense" role="alert"><MmIcon i="alert-circle" :s="18" /><span class="grow">{{ error }}</span></div>
        </div>

        <template v-else-if="mov">
          <div class="mm-modal-b" style="padding-top: 28px; align-items: center; text-align: center; gap: 16px">
            <div class="mm-ico lg expense mm-popin" style="width: 64px; height: 64px; border-radius: 20px"><MmIcon i="trash" :s="30" /></div>
            <div class="col gap-1">
              <h2 id="eliminar-titulo" class="t-h2">¿Eliminar este movimiento?</h2>
              <p id="eliminar-desc" class="t-sm muted">No podrás recuperarlo después.</p>
            </div>

            <div class="mm-card flat" style="width: 100%; padding: 14px; text-align: left">
              <div class="row gap-3">
                <div class="mm-ico cat sm" :style="{background: colorMovimiento(mov)}"><MmIcon :i="iconoMovimiento(mov)" :s="18" /></div>
                <div class="grow" style="min-width: 0">
                  <div class="t-label ellipsis">{{ describirMovimiento(mov).titulo }}</div>
                  <div class="t-xs muted ellipsis">{{ fechaCorta(mov.fecha) }} · {{ cuentaDeMovimiento(mov) }}</div>
                </div>
                <b class="t-amt">{{ montoConSigno(mov) }}</b>
              </div>
            </div>

            <div v-if="efectos.length" class="mm-banner expense" style="width: 100%; text-align: left">
              <MmIcon i="information-circle" :s="18" />
              <span>
                <template v-for="(e, i) in efectos" :key="e.nombre"><template v-if="i"> y </template>{{ e.nombre }} vuelve a <b class="num">{{ moneda(e.saldo, e.divisaId) }}</b></template>.
              </span>
            </div>
          </div>

          <div class="mm-modal-f" style="justify-content: stretch">
            <button type="button" class="mm-btn ghost grow" :disabled="eliminando" @click="emit('cerrar')">Cancelar</button>
            <button type="button" class="mm-btn danger grow" :class="{'is-loading': eliminando}" :disabled="eliminando" @click="eliminar"><MmIcon i="trash" :s="18" />Sí, eliminar</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
