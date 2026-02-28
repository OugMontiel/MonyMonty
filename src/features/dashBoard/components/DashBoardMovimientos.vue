<script setup>
import {ref} from "vue";
import {useToast} from "primevue/usetoast";
import {Icon} from "@iconify/vue";

// Modales
import CreateMovimientoModal from "../../movimientos/components/modals/CreateMovimientoModal.vue";

// Constantes
import {MOVEMENTS_HELP_TEXT} from "../logic/dashBoardConstants.js";

// Stores
import {useLoadingStore} from "@/stores/contexto/loadingStore";
import {dataDashBoardStore} from "../../../stores/contexto/dataDashBoardStore";

// UI PrimeVue
const toast = useToast();

// Stores
const loadingStore = useLoadingStore();
const storeData = dataDashBoardStore();

const isModalOpen = ref(false);
const modalMode = ref("VIEW");
const selectedMovimientoId = ref(null);

const handlePage = (event) => {
  storeData.setPaginationListaMovimientos({
    page: event.page + 1,
    limit: event.rows,
  });

  storeData.fetchListaMovimientos();
};

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
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-semibold flex items-end gap-2 flex-wrap">
      <i class="pi pi-list"></i>
      Movimientos
      <span class="text-xs font-normal text-gray-400">
        {{ MOVEMENTS_HELP_TEXT.STANDARD }}
      </span>
    </h3>
  </div>
  <DataTable
    :value="storeData.dataDashBoard.listaMovimientos"
    lazy
    paginator
    :rows="storeData.pagination.listaMovimientos.limit"
    :totalRecords="storeData.pagination.listaMovimientos.totalData"
    :loading="loadingStore.dashboardMovimientos"
    @page="handlePage"
    responsiveLayout="scroll"
    class="text-sm bg-transparent"
    :rowClass="
      (data) => [
        'rounded-lg',
        'shadow-sm',
        'mb-2',
        'bg-white',
        data.tipo === 'EGRESO' ? 'border-l-4 border-red-500' : '',
        data.tipo === 'INGRESO' ? 'border-l-4 border-green-500' : '',
      ]
    "
  >
    <template #empty>
      <div class="text-center py-6 text-gray-400">
        <i class="pi pi-inbox text-3xl mb-2"></i>
        <p>No hay movimientos recientes</p>
      </div>
    </template>

    <Column header="Movimiento">
      <template #body="{data}">
        <div class="flex flex-col">
          <span class="font-semibold text-gray-800">
            {{ data.entidad?.nombre || "Transferencia" }}
          </span>
          <span class="text-xs text-gray-500">
            {{ data.categoria?.categoria }} · {{ data.subcategoria?.subcategoria }} ·
            {{ data.concepto?.titulo }}
          </span>
        </div>
      </template>
    </Column>

    <Column header="Monto" class="text-center" sortable field="fecha">
      <template #body="{data}">
        <div class="flex flex-col items-center">
          <span class="text-lg font-bold" :class="data.tipo === 'EGRESO' ? 'text-red-600' : 'text-green-600'">
            {{ data.tipo === "EGRESO" ? "-" : "+" }}
            {{ data.monto.toLocaleString() }} {{ data.divisaId }}
          </span>
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

  <CreateMovimientoModal
    v-model:visible="isModalOpen"
    :mode="modalMode"
    :movementId="selectedMovimientoId"
    @saved="storeData.fetchListaMovimientos()"
  />
</template>
