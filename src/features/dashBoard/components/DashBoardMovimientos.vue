<script setup>
import {ref, onMounted} from "vue";
import {useToast} from "primevue/usetoast";
import {Icon} from "@iconify/vue";
import {dataMovimientos} from "../logic/movimientos.js";
import CreateMovimientoModal from "../../movimientos/modals/CreateMovimientoModal.vue";

const toast = useToast();
const {getAllMovimientos} = dataMovimientos();
const movimientos = ref([]);
const loading = ref(false);
const totalRecords = ref(0);
const lazyParams = ref({
  page: 0,
  rows: 10,
});

const isModalOpen = ref(false);
const modalMode = ref("VIEW");
const selectedMovimiento = ref(null);

const loadMovimientos = async () => {
  loading.value = true;
  try {
    const page = lazyParams.value.page + 1; // PrimeVue paginator is 0-indexed
    const limit = lazyParams.value.rows;
    const resMovs = await getAllMovimientos(page, limit);

    // The backend now returns { data: [], total: number, page: number, ... }
    // inside resMovs.data.data
    movimientos.value = resMovs.data.data.data;
    totalRecords.value = resMovs.data.data.total;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error de conexión",
      detail: "Inténtalo de nuevo cargar los movimientos.",
      life: 4000,
    });
  } finally {
    loading.value = false;
  }
};

const onPage = (event) => {
  lazyParams.value = event;
  loadMovimientos();
};

onMounted(() => {
  loadMovimientos();
});

const verMovimiento = (data) => {
  selectedMovimiento.value = data;
  modalMode.value = "VIEW";
  isModalOpen.value = true;
};

const editarMovimiento = (data) => {
  selectedMovimiento.value = data;
  modalMode.value = "EDIT";
  isModalOpen.value = true;
};

const eliminarMovimiento = (data) => {
  selectedMovimiento.value = data;
  modalMode.value = "DELETE";
  isModalOpen.value = true;
};
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-semibold flex items-center gap-2">
      <i class="pi pi-list"></i>
      Últimos movimientos
    </h3>
  </div>
  <DataTable
    :value="movimientos"
    :lazy="true"
    :paginator="true"
    :rows="lazyParams.rows"
    :totalRecords="totalRecords"
    :loading="loading"
    @page="onPage"
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

  <CreateMovimientoModal v-model:visible="isModalOpen" :mode="modalMode" :initialData="selectedMovimiento" @saved="loadMovimientos" />
</template>
