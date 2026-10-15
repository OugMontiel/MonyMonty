<script setup>
/**
 * Detalle de un movimiento (panel lateral). Pide GET movimiento/:id y complementa con lo ya
 * cargado: saldo de la cuenta después del movimiento, otros movimientos de la misma categoría
 * en el mes y los nombres de las cuentas de una transferencia.
 */
import {ref, computed, watch, nextTick} from "vue";

import MmIcon from "@/components/mm/MmIcon.vue";
import {useAppUi} from "@/composables/useAppUi.js";
import {useTablero} from "@/features/dashBoard/logic/useTablero.js";
import {describirMovimiento, fechaLarga, moneda, montoConSigno, TIPOS_MOVIMIENTO, colorMovimiento, iconoMovimiento, TIPOS_ENTIDAD, ENTIDAD_GENERICA} from "@/features/dashBoard/logic/formato.js";
import {useMovimientos} from "../logic/CreateMovimiento.js";
import {movimientos} from "../logic/movimientosStore.js";

const props = defineProps({
  id: {type: String, required: true},
});
const emit = defineEmits(["cerrar"]);

const {abrirMovimiento} = useAppUi();
const {cuentas} = useTablero();
const {getMovimiento} = useMovimientos();

const mov = ref(null);
const cargando = ref(true);
const error = ref("");
const panel = ref(null);

async function cargar() {
  cargando.value = true;
  error.value = "";
  mov.value = null;
  try {
    mov.value = (await getMovimiento(props.id)).data;
  } catch (err) {
    error.value = err.response?.data?.message || "No pudimos cargar este movimiento.";
  } finally {
    cargando.value = false;
    await nextTick();
    panel.value?.focus();
  }
}
watch(() => props.id, cargar, {immediate: true});

const tipo = computed(() => TIPOS_MOVIMIENTO[mov.value?.tipo]);
const esTransferencia = computed(() => mov.value?.tipo === "TRANSFERENCIA");
const titulo = computed(() => (mov.value ? describirMovimiento(mov.value).titulo : ""));
const dinero = (v, d = mov.value?.divisaId) => moneda(v, d);

// ---------- Cuentas ----------
const cuentaPorId = (id) => cuentas.value.find((c) => c.id === id);
const tipoDe = (c) => TIPOS_ENTIDAD[c?.tipo] ?? ENTIDAD_GENERICA;

/** Saldo de una cuenta justo después de este movimiento, sumando todo lo anterior en el tiempo */
function saldoDespues(idCuenta) {
  if (!mov.value || !movimientos.value.some((m) => m._id === mov.value._id)) return null;
  const orden = [...movimientos.value].sort((a, b) => new Date(a.fecha) - new Date(b.fecha) || a._id.localeCompare(b._id));
  const limite = orden.findIndex((m) => m._id === mov.value._id);
  let saldo = 0;
  for (const m of orden.slice(0, limite + 1)) {
    if (m.tipo === "INGRESO" && m.entidadId === idCuenta) saldo += m.monto;
    else if (m.tipo === "EGRESO" && m.entidadId === idCuenta) saldo -= m.monto;
    else if (m.tipo === "TRANSFERENCIA") {
      if (m.transferencia?.origenEntidadId === idCuenta) saldo -= m.monto;
      if (m.transferencia?.destinoEntidadId === idCuenta) saldo += m.monto;
    }
  }
  return saldo;
}

const origen = computed(() => cuentaPorId(mov.value?.transferencia?.origenEntidadId));
const destino = computed(() => cuentaPorId(mov.value?.transferencia?.destinoEntidadId));
const cuenta = computed(() => cuentaPorId(mov.value?.entidadId));

// ---------- Otros movimientos de la misma categoría en el mes ----------
const similares = computed(() => {
  if (!mov.value || esTransferencia.value || !mov.value.categoriaId) return null;
  const f = new Date(mov.value.fecha);
  const mismoMes = (m) => {
    const x = new Date(m.fecha);
    return x.getFullYear() === f.getFullYear() && x.getMonth() === f.getMonth() && m.tipo === mov.value.tipo && !m.esSistema;
  };
  const delMes = movimientos.value.filter(mismoMes);
  const deCategoria = delMes.filter((m) => m.categoriaId === mov.value.categoriaId);
  const totalMes = delMes.reduce((s, m) => s + m.monto, 0);
  const total = deCategoria.reduce((s, m) => s + m.monto, 0);
  if (deCategoria.length < 2 || !totalMes) return null;
  return {cantidad: deCategoria.length, total, pct: Math.round((total / totalMes) * 100)};
});

const nota = computed(() => mov.value?.concepto?.detalle?.trim());

function editar() {
  abrirMovimiento(props.id, "EDIT");
}
function eliminar() {
  abrirMovimiento(props.id, "DELETE");
}
</script>

<template>
  <div class="mm-root" data-theme="light">
    <div class="mm-overlay right" @click.self="emit('cerrar')">
      <div ref="panel" class="mm-drawer" role="dialog" aria-modal="true" aria-labelledby="detalle-titulo" tabindex="-1" style="width: min(460px, 100%); outline: 0" @keydown.esc="emit('cerrar')">
        <div class="mm-modal-h" style="padding-bottom: 8px">
          <span v-if="tipo" class="mm-badge" :class="tipo.tono"><MmIcon :i="tipo.icono" :s="12" />{{ tipo.etiqueta }}</span>
          <span class="grow"></span>
          <button v-if="mov && !mov.esSistema" type="button" class="mm-btn icon sm ghost" aria-label="Editar" @click="editar"><MmIcon i="create" :s="18" /></button>
          <button type="button" class="mm-x" aria-label="Cerrar" @click="emit('cerrar')"><MmIcon i="close" :s="20" /></button>
        </div>

        <!-- Carga -->
        <div v-if="cargando" class="mm-modal-b" style="flex: 1; align-items: center" role="status" aria-label="Cargando el movimiento">
          <div class="mm-skel" style="width: 64px; height: 64px; border-radius: 20px"></div>
          <div class="mm-skel" style="width: 200px; height: 22px"></div>
          <div class="mm-skel" style="width: 160px; height: 36px"></div>
          <div class="mm-skel" style="width: 100%; height: 150px; margin-top: 12px"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="mm-modal-b" style="flex: 1">
          <div class="mm-banner expense" role="alert"><MmIcon i="alert-circle" :s="18" /><span class="grow">{{ error }}</span><button type="button" class="mm-btn sm" @click="cargar">Reintentar</button></div>
        </div>

        <template v-else-if="mov">
          <div class="mm-modal-b" style="gap: 22px; flex: 1; overflow: auto">
            <div class="col mm-rise" style="align-items: center; text-align: center; gap: 10px; padding: 8px 0 4px">
              <div class="mm-ico cat lg mm-popin" :style="{background: colorMovimiento(mov), width: '64px', height: '64px', borderRadius: '20px', '--i': 2}"><MmIcon :i="iconoMovimiento(mov)" :s="30" /></div>
              <h2 id="detalle-titulo" class="t-h2">{{ titulo }}</h2>
              <div class="t-amt-xl" :class="tipo.clase">{{ montoConSigno(mov) }}</div>
              <span class="t-sm muted">{{ fechaLarga(mov.fecha) }}</span>
            </div>

            <div v-if="mov.esSistema" class="mm-banner info"><MmIcon i="information-circle" :s="18" /><span>Este ingreso lo creó MonyMonty al abrir la cuenta con su saldo inicial.</span></div>

            <div class="mm-card flat" style="padding: 4px 16px">
              <template v-if="!esTransferencia">
                <div class="fila"><span class="muted t-sm">Categoría</span><span class="row gap-2"><i class="mm-dot" :style="{background: mov.categoria?.color || 'var(--cat-slate)'}"></i><b class="t-sm">{{ mov.categoria?.categoria }}<template v-if="mov.subcategoria?.subcategoria"> · {{ mov.subcategoria.subcategoria }}</template></b></span></div>
                <div class="fila">
                  <span class="muted t-sm">Cuenta</span>
                  <b class="t-sm">{{ mov.entidad?.nombre }}<template v-if="mov.entidad?.numero"> •••• {{ mov.entidad.numero }}</template></b>
                </div>
                <div v-if="saldoDespues(mov.entidadId) !== null" class="fila"><span class="muted t-sm">Saldo después</span><b class="t-sm num">{{ dinero(saldoDespues(mov.entidadId)) }}</b></div>
              </template>
              <template v-else>
                <div class="fila">
                  <span class="muted t-sm">Desde</span>
                  <span class="row gap-2"><MmIcon :i="tipoDe(origen).icono" :s="16" /><b class="t-sm">{{ origen?.nombre ?? "—" }}</b></span>
                </div>
                <div v-if="saldoDespues(mov.transferencia?.origenEntidadId) !== null" class="fila"><span class="muted t-sm">Queda en</span><b class="t-sm num">{{ dinero(saldoDespues(mov.transferencia.origenEntidadId)) }}</b></div>
                <div class="fila">
                  <span class="muted t-sm">Hacia</span>
                  <span class="row gap-2"><MmIcon :i="tipoDe(destino).icono" :s="16" /><b class="t-sm">{{ destino?.nombre ?? "—" }}</b></span>
                </div>
                <div v-if="saldoDespues(mov.transferencia?.destinoEntidadId) !== null" class="fila"><span class="muted t-sm">Queda en</span><b class="t-sm num">{{ dinero(saldoDespues(mov.transferencia.destinoEntidadId)) }}</b></div>
              </template>
              <div class="fila"><span class="muted t-sm">Repetir</span><b class="t-sm">{{ mov.esRecurrente ? "Sí" : "No" }}</b></div>
              <div v-if="mov.referencia" class="fila"><span class="muted t-sm">Referencia</span><b class="t-sm num">{{ mov.referencia }}</b></div>
              <div v-if="mov.estado" class="fila"><span class="muted t-sm">Estado</span><b class="t-sm">{{ mov.estado.charAt(0) + mov.estado.slice(1).toLowerCase() }}</b></div>
              <div v-if="mov.tags?.length" class="fila"><span class="muted t-sm">Etiquetas</span><span class="row" style="flex-wrap: wrap; gap: 6px; justify-content: flex-end"><span v-for="t in mov.tags" :key="t" class="mm-badge">{{ t }}</span></span></div>
            </div>

            <div v-if="nota" class="mm-field">
              <span class="mm-flabel">Nota</span>
              <div class="mm-card flat" style="background: var(--surface-2); border: 0; padding: 14px"><p class="t-sm">{{ nota }}</p></div>
            </div>

            <div v-if="similares" class="col gap-2">
              <span class="t-over">Más de {{ mov.categoria?.categoria }} este mes</span>
              <div class="row between t-sm"><span>{{ similares.cantidad }} movimientos</span><b class="num">{{ dinero(similares.total) }}</b></div>
              <div class="mm-progress sm" role="img" :aria-label="`${similares.pct} % del total del mes`"><i :style="{'--w': `${similares.pct}%`, '--c': mov.categoria?.color}"></i></div>
              <span class="t-xs muted">{{ similares.pct }} % de todo lo que {{ mov.tipo === "INGRESO" ? "entró" : "salió" }} este mes</span>
            </div>

            <p v-if="mov.auditoria?.creadoPor?.nombre" class="t-xs muted">Registrado por {{ mov.auditoria.creadoPor.nombre }}</p>
          </div>

          <div class="mm-modal-f">
            <button v-if="!mov.esSistema" type="button" class="mm-btn danger-soft" @click="eliminar"><MmIcon i="trash" :s="18" />Eliminar</button>
            <span class="grow"></span>
            <button v-if="!mov.esSistema" type="button" class="mm-btn primary" @click="editar"><MmIcon i="create" :s="18" />Editar</button>
            <button v-else type="button" class="mm-btn" @click="emit('cerrar')">Cerrar</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fila {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}
.fila:last-child {
  border-bottom: 0;
}
</style>
