<script setup>
/**
 * Layout de las pantallas autenticadas: barra lateral + contenido (router-view), con el
 * botón flotante, la barra inferior móvil, la búsqueda, las notificaciones y los modales
 * de creación montados una sola vez para todas las pantallas.
 */
import {computed, onMounted, onBeforeUnmount} from "vue";

import {useAppUi} from "@/composables/useAppUi.js";
import MmSidebar from "@/components/mm/layout/MmSidebar.vue";
import MmBottomNav from "@/components/mm/layout/MmBottomNav.vue";
import MmQuickActions from "@/components/mm/layout/MmQuickActions.vue";
import MmSearchDialog from "@/components/mm/layout/MmSearchDialog.vue";
import MmNotifications from "@/components/mm/layout/MmNotifications.vue";
import DetalleMovimiento from "../../movimientos/components/DetalleMovimiento.vue";
import CreateMovimientoModal from "../../movimientos/components/modals/CreateMovimientoModal.vue";
import CreateEntidadModal from "../../movimientos/components/modals/CreateEntidadModal.vue";
import CreateCategoriaModal from "../../movimientos/components/modals/CreateCategoriaModal.vue";

const {
  sidebarColapsada,
  modalMovimiento,
  modalCuenta,
  modalCategoria,
  movimientoAbierto,
  busquedaAbierta,
  notificacionesAbiertas,
  accionesRapidasAbiertas,
  nuevoMovimiento,
} = useAppUi();

// Sin movimiento seleccionado el modal crea uno nuevo
const modoMovimiento = computed(() => movimientoAbierto.value?.modo ?? "CREATE");
const idMovimiento = computed(() => movimientoAbierto.value?.id ?? null);

// Ver un movimiento abre el panel de detalle; crear, editar y eliminar usan el modal
const detalleAbierto = computed(() => modalMovimiento.value && modoMovimiento.value === "VIEW" && Boolean(idMovimiento.value));
const modalAbierto = computed(() => modalMovimiento.value && !detalleAbierto.value);

const algoAbierto = computed(
  () => modalMovimiento.value || modalCuenta.value || modalCategoria.value || busquedaAbierta.value || notificacionesAbiertas.value || accionesRapidasAbiertas.value
);

const esCampoDeTexto = (el) => el && (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) || el.isContentEditable);

// Atajos: Ctrl/Cmd + K busca, N registra un movimiento y Escape cierra lo que esté abierto
function alTeclear(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    busquedaAbierta.value = !busquedaAbierta.value;
    return;
  }
  if (e.key === "Escape") {
    busquedaAbierta.value = false;
    notificacionesAbiertas.value = false;
    accionesRapidasAbiertas.value = false;
    return;
  }
  if (e.key.toLowerCase() === "n" && !e.ctrlKey && !e.metaKey && !e.altKey && !esCampoDeTexto(e.target) && !algoAbierto.value) {
    e.preventDefault();
    nuevoMovimiento();
  }
}

onMounted(() => document.addEventListener("keydown", alTeclear));
onBeforeUnmount(() => document.removeEventListener("keydown", alTeclear));
</script>

<template>
  <div class="mm-root" data-theme="light">
    <div class="mm-app" :class="{'is-collapsed': sidebarColapsada}">
      <MmSidebar />

      <main class="mm-main">
        <router-view v-slot="{Component}">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </main>

      <MmQuickActions />
      <MmBottomNav />
    </div>

    <DetalleMovimiento v-if="detalleAbierto" :id="idMovimiento" @cerrar="modalMovimiento = false" />
    <MmSearchDialog />
    <MmNotifications />
  </div>

  <!-- Los modales son de PrimeVue y se dibujan solos en el body; al guardar refrescan el tablero por useGlobalState -->
  <CreateMovimientoModal :visible="modalAbierto" :mode="modoMovimiento" :movementId="idMovimiento" @update:visible="modalMovimiento = $event" />
  <CreateEntidadModal v-model:visible="modalCuenta" />
  <CreateCategoriaModal v-model:visible="modalCategoria" />
</template>
