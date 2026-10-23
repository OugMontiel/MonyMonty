<script setup>
/**
 * Modal "Dividir gasto": una compra con varias categorías (por ejemplo, un mercado que también trae
 * aseo y droguería). La API no tiene un recurso de divisiones: el gasto original se queda con la
 * primera parte y las demás se crean como gastos nuevos con la misma fecha, cuenta y nombre.
 * Dividir con otras personas necesita deudas, que la API aún no tiene.
 */
import {ref, reactive, computed, onMounted} from "vue";

import MmIcon from "@/components/mm/MmIcon.vue";
import MmSelect from "@/components/mm/MmSelect.vue";
import {useAvisos} from "@/composables/useAvisos.js";
import {iconoDe, moneda, describirMovimiento, fechaCorta, formatearMontoTexto, leerMontoTexto, montoATexto} from "@/features/dashBoard/logic/formato.js";
import {useMovimientos} from "@/features/movimientos/logic/CreateMovimiento.js";
import {useMovimientoOptions} from "@/features/movimientos/logic/OptionsMovimiento.js";
import {movimientos} from "@/features/movimientos/logic/movimientosStore.js";

const props = defineProps({
  id: {type: String, required: true},
});
const emit = defineEmits(["cerrar"]);

const {mostrar} = useAvisos();
const {createMovimiento, updateMovimiento, getMovimiento, deleteMovimiento, loading: guardando} = useMovimientos();
const {categorias, fetchOptions} = useMovimientoOptions();

const original = ref(null);
const cargando = ref(true);
const errorCarga = ref("");
const intentado = ref(false);
const partes = reactive([]);
let consecutivo = 0;

const total = computed(() => original.value?.monto ?? 0);
const divisa = computed(() => original.value?.divisaId ?? "COP");
const dinero = (v) => moneda(v, divisa.value);
const decimales = computed(() => !["COP", "CLP", "PYG", "JPY"].includes(divisa.value));
const titulo = computed(() => (original.value ? describirMovimiento(original.value) : {titulo: "", detalle: ""}));

// ---------- Categorías ----------
const opcionesCategoria = computed(() =>
  categorias.value.map((c) => {
    const ejemplo = movimientos.value.find((m) => m.categoriaId === c.value)?.categoria;
    return {value: c.value, label: c.label, color: ejemplo?.color ?? "var(--cat-slate)", icono: iconoDe(ejemplo?.icono)};
  })
);
const colorDe = (id) => opcionesCategoria.value.find((o) => o.value === id)?.color ?? "var(--cat-slate)";

// ---------- Reparto ----------
const sumaPartes = computed(() => partes.reduce((s, p) => s + leerMontoTexto(p.montoTexto), 0));
const diferencia = computed(() => Math.round((total.value - sumaPartes.value) * 100) / 100);
const cuadra = computed(() => diferencia.value === 0);

const errores = computed(() => {
  if (partes.length < 2) return "Agrega al menos dos categorías.";
  if (partes.some((p) => !p.categoriaId)) return "Elige una categoría en cada parte.";
  if (partes.some((p) => !(leerMontoTexto(p.montoTexto) > 0))) return "Cada parte debe tener un monto mayor a cero.";
  if (!cuadra.value) return diferencia.value > 0 ? `Faltan ${dinero(diferencia.value)} por repartir.` : `Te pasas ${dinero(-diferencia.value)} del total.`;
  return "";
});

const segmentos = computed(() => partes.map((p) => ({id: p.id, ancho: total.value ? Math.min(100, (leerMontoTexto(p.montoTexto) / total.value) * 100) : 0, color: colorDe(p.categoriaId)})));

function agregarParte() {
  const usadas = new Set(partes.map((p) => p.categoriaId));
  const libre = categorias.value.find((c) => !usadas.has(c.value))?.value ?? categorias.value[0]?.value ?? "";
  // La parte nueva toma lo que aún falta repartir
  partes.push({id: ++consecutivo, categoriaId: libre, montoTexto: diferencia.value > 0 ? montoATexto(diferencia.value, decimales.value) : ""});
}

function quitarParte(i) {
  partes.splice(i, 1);
}

function alEscribir(p, e) {
  p.montoTexto = formatearMontoTexto(e.target.value, decimales.value);
  e.target.value = p.montoTexto;
}

// ---------- Guardar ----------
/** Datos del movimiento original que se conservan en cada parte */
function baseDe(m) {
  return {
    tipo: m.tipo,
    fecha: m.fecha,
    divisaId: m.divisaId,
    entidadId: m.entidadId,
    concepto: m.concepto,
    tags: m.tags ?? [],
    esRecurrente: Boolean(m.esRecurrente),
    origen: m.origen ?? "MANUAL",
    estado: m.estado ?? "COMPLETADO",
  };
}

const subcategoriaDe = (categoriaId) => categorias.value.find((c) => c.value === categoriaId)?.subcategorias?.[0]?.value ?? "";

async function guardar() {
  intentado.value = true;
  if (errores.value) return;

  const base = baseDe(original.value);
  const [primera, ...resto] = partes;
  const creados = [];
  try {
    // Primero se crean las partes nuevas: si algo falla, el gasto original sigue intacto
    for (const p of resto) {
      const res = await createMovimiento({...base, monto: leerMontoTexto(p.montoTexto), categoriaId: p.categoriaId, subcategoriaId: subcategoriaDe(p.categoriaId)});
      creados.push(res?.data?.insertedId);
    }
    // Si la primera conserva la categoría original también se conserva su subcategoría
    const mismaCategoria = primera.categoriaId === original.value.categoriaId;
    await updateMovimiento(props.id, {
      ...base,
      monto: leerMontoTexto(primera.montoTexto),
      categoriaId: primera.categoriaId,
      subcategoriaId: mismaCategoria ? original.value.subcategoriaId : subcategoriaDe(primera.categoriaId),
    });
    mostrar({titulo: "Gasto dividido", detalle: `${titulo.value.titulo} · ${dinero(total.value)} en ${partes.length} categorías`});
    emit("cerrar");
  } catch (err) {
    // Se deshacen las partes que alcanzaron a crearse
    await Promise.allSettled(creados.filter(Boolean).map((id) => deleteMovimiento(id)));
    mostrar({tono: "expense", icono: "alert-circle", titulo: "No se pudo dividir el gasto", detalle: err.response?.data?.message || "No se hizo ningún cambio. Inténtalo de nuevo."});
  }
}

onMounted(async () => {
  try {
    await fetchOptions();
    const m = (await getMovimiento(props.id)).data;
    if (m.tipo !== "EGRESO" || m.esSistema) throw new Error("Solo se pueden dividir gastos.");
    original.value = m;
    partes.push({id: ++consecutivo, categoriaId: m.categoriaId, montoTexto: montoATexto(m.monto, decimales.value)});
    // La segunda parte arranca vacía, con otra categoría, lista para recibir parte del monto
    const otra = categorias.value.find((c) => c.value !== m.categoriaId)?.value ?? "";
    partes.push({id: ++consecutivo, categoriaId: otra, montoTexto: ""});
  } catch (err) {
    errorCarga.value = err.response?.data?.message || err.message || "No pudimos cargar este gasto.";
  } finally {
    cargando.value = false;
  }
});

function alTeclear(e) {
  if (e.key === "Escape") emit("cerrar");
}
</script>

<template>
  <div class="mm-root" data-theme="light">
    <div class="mm-overlay" @click.self="emit('cerrar')">
      <div class="mm-modal" role="dialog" aria-modal="true" aria-labelledby="dividir-titulo" style="width: min(580px, 100%)" @keydown="alTeclear">
        <div class="mm-modal-h">
          <div class="mm-ico cat" :style="{background: colorDe(original?.categoriaId)}"><MmIcon i="pricetags" :s="22" /></div>
          <div class="grow"><h2 id="dividir-titulo" class="t-h2">Dividir gasto</h2><p class="t-sm muted">Una compra, varias categorías</p></div>
          <button type="button" class="mm-x" aria-label="Cerrar" @click="emit('cerrar')"><MmIcon i="close" :s="20" /></button>
        </div>

        <div v-if="cargando" class="mm-modal-b" role="status" aria-label="Cargando el gasto"><div class="mm-skel" style="width: 100%; height: 200px"></div></div>
        <div v-else-if="errorCarga" class="mm-modal-b"><div class="mm-banner expense" role="alert"><MmIcon i="alert-circle" :s="18" /><span class="grow">{{ errorCarga }}</span></div></div>

        <template v-else>
          <div class="mm-modal-b">
            <div class="mm-card flat row between" style="padding: 12px 16px; background: var(--surface-2); border: 0">
              <div class="grow" style="min-width: 0"><b class="ellipsis" style="display: block">{{ titulo.titulo }}</b><div class="t-xs muted ellipsis">{{ fechaCorta(original.fecha) }}<template v-if="titulo.detalle"> · {{ titulo.detalle }}</template></div></div>
              <b class="t-amt">{{ dinero(total) }}</b>
            </div>

            <div class="col gap-2">
              <div v-for="(p, i) in partes" :key="p.id" class="row gap-3">
                <div class="grow" style="min-width: 0"><MmSelect v-model="p.categoriaId" :options="opcionesCategoria" placeholder="Categoría" :aria-label="`Categoría de la parte ${i + 1}`" /></div>
                <div class="mm-input" style="width: 150px"><span class="muted">$</span><input :value="p.montoTexto" inputmode="decimal" placeholder="0" :aria-label="`Monto de la parte ${i + 1}`" @input="alEscribir(p, $event)" /></div>
                <button v-if="partes.length > 2" type="button" class="mm-btn icon sm ghost" :aria-label="`Quitar la parte ${i + 1}`" @click="quitarParte(i)"><MmIcon i="close" :s="16" /></button>
              </div>
            </div>
            <button type="button" class="mm-btn sm ghost" style="align-self: flex-start" @click="agregarParte"><MmIcon i="add" :s="16" />Agregar otra categoría</button>

            <div class="row" style="height: 10px; border-radius: 999px; overflow: hidden; gap: 2px; background: var(--surface-2)" aria-hidden="true">
              <i v-for="s in segmentos" :key="s.id" :style="{width: `${s.ancho}%`, height: '100%', background: s.color, transition: 'width var(--dur-base) var(--ease-out)'}"></i>
            </div>
            <div v-if="cuadra && partes.length >= 2" class="mm-banner income"><MmIcon i="checkmark-circle" :s="18" /><span class="t-sm">Cuadra exacto: {{ dinero(total) }} repartidos en {{ partes.length }} categorías.</span></div>
            <div v-else class="mm-banner" :class="intentado ? 'expense' : 'info'"><MmIcon :i="intentado ? 'alert-circle' : 'information-circle'" :s="18" /><span class="t-sm">{{ errores }}</span></div>
          </div>

          <div class="mm-modal-f">
            <button type="button" class="mm-btn ghost" @click="emit('cerrar')">Cancelar</button>
            <button type="button" class="mm-btn primary" :class="{'is-loading': guardando}" :disabled="guardando" @click="guardar"><MmIcon i="checkmark" :s="18" />Guardar división</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
