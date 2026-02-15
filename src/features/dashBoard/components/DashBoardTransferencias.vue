<script setup>
import {ref, onMounted} from "vue";
import {useToast} from "primevue/usetoast";
import {Icon} from "@iconify/vue";
import {dataMovimientos} from "../logic/movimientos.js";
import {MOVEMENTS_HELP_TEXT} from "../logic/dashBoardConstants.js";
import {useLoadingStore} from "@/stores/loadingStore";

// Note: We might reuse CreateMovimientoModal if it supports Transfer viewing,
// othewise we might need to adjust it. Assuming it handles it.
import CreateMovimientoModal from "../../movimientos/components/modals/CreateMovimientoModal.vue";

const toast = useToast();
const {getAllMovimientos} = dataMovimientos();
const transferencias = ref([]);
const loadingStore = useLoadingStore();
const totalRecords = ref(0);
const lazyParams = ref({
  page: 0,
  rows: 4, // Limit requested
});

const isModalOpen = ref(false);
const modalMode = ref("VIEW");
const selectedMovimientoId = ref(null);

const loadTransferencias = async () => {
  loadingStore.dashboardTransferencias = true;
  try {
    const page = lazyParams.value.page + 1;
    const limit = lazyParams.value.rows;
    // Request only TRANSFERENCIA
    const resMovs = await getAllMovimientos(page, limit, {tipo: "TRANSFERENCIA"});

    transferencias.value = resMovs.data.data.data;
    totalRecords.value = resMovs.data.data.total;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error de conexión",
      detail: "Inténtalo de nuevo cargar las transferencias.",
      life: 4000,
    });
  } finally {
    loadingStore.dashboardTransferencias = false;
  }
};

const onPage = (event) => {
  lazyParams.value = event;
  loadTransferencias();
};

onMounted(() => {
  loadTransferencias();
});

const verMovimiento = (data) => {
  selectedMovimientoId.value = data._id;
  modalMode.value = "VIEW";
  isModalOpen.value = true;
};

const editarMovimiento = (data) => {
  selectedMovimientoId.value = data._id;
  modalMode.value = "EDIT";
  isModalOpen.value = true;
};

const eliminarMovimiento = (data) => {
  selectedMovimientoId.value = data._id;
  modalMode.value = "DELETE";
  isModalOpen.value = true;
};
</script>

<template>
  <div class="flex items-center justify-between mb-4 mt-6">
    <h3 class="text-xl font-semibold flex items-end gap-2 flex-wrap">
      <i class="pi pi-arrow-right-arrow-left"></i>
      Transferencias
      <span class="text-xs font-normal text-gray-400">
        {{ MOVEMENTS_HELP_TEXT.TRANSFERENCIA }}
      </span>
    </h3>
  </div>
  <DataTable
    :value="transferencias"
    :lazy="true"
    :paginator="true"
    :rows="lazyParams.rows"
    :totalRecords="totalRecords"
    :loading="loadingStore.dashboardTransferencias"
    @page="onPage"
    responsiveLayout="scroll"
    class="text-sm bg-transparent"
    :rowClass="() => ['rounded-lg', 'shadow-sm', 'mb-2', 'bg-white', 'border-l-4', 'border-blue-300']"
  >
    <template #empty>
      <div class="text-center py-6 text-gray-400">
        <i class="pi pi-refresh text-3xl mb-2"></i>
        <p>No hay transferencias recientes</p>
      </div>
    </template>

    <Column header="Origen / Destino">
      <template #body="{data}">
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-gray-800">
              {{ data.transferenciaDetalle?.origen?.nombre || "Origen desc." }}
            </span>
            <i class="pi pi-arrow-right text-xs text-gray-400"></i>
            <span class="font-semibold text-gray-800">
              {{ data.transferenciaDetalle?.destino?.nombre || "Destino desc." }}
            </span>
          </div>
          <span class="text-xs text-gray-500">
            {{ data.concepto?.titulo || "Sin concepto" }}
          </span>
        </div>
      </template>
    </Column>

    <Column header="Monto" class="text-center" sortable field="fecha">
      <template #body="{data}">
        <div class="flex flex-col items-center">
          <span class="text-lg font-bold text-gray-700"> {{ data.monto.toLocaleString() }} {{ data.divisaId }} </span>
          <span class="text-xs text-gray-400">
            {{ new Date(data.fecha).toLocaleDateString() }}
          </span>
        </div>
      </template>
    </Column>

    <Column header="Acciones" class="text-center">
      <template #body="{data}">
        <div class="flex justify-center gap-2">
          <!-- Card para Editar y Ver -->
          <div class="flex gap-2 bg-gray-50 border border-gray-100 rounded-md p-1.5 shadow-sm">
            <Icon
              icon="ion:eye-outline"
              class="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-700 transition-colors"
              @click="verMovimiento(data)"
            />
            <Icon
              icon="ion:create-outline"
              class="w-5 h-5 cursor-pointer text-gray-600 hover:text-yellow-700 transition-colors"
              @click="editarMovimiento(data)"
            />
          </div>

          <!-- Card para Eliminar -->
          <div class="flex bg-red-50 border border-red-100 rounded-md p-1.5 shadow-sm">
            <Icon
              icon="ion:trash-outline"
              class="w-5 h-5 cursor-pointer text-red-500 hover:text-red-700 transition-colors"
              @click="eliminarMovimiento(data)"
            />
          </div>
        </div>
      </template>
    </Column>
  </DataTable>

  <CreateMovimientoModal v-model:visible="isModalOpen" :mode="modalMode" :movementId="selectedMovimientoId" @saved="loadTransferencias" />
</template>
