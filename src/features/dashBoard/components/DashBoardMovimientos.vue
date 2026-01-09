<script setup>
import {Icon} from "@iconify/vue";

defineProps({
  movimientos: {
    type: Array,
    default: () => [],
  },
});

const verMovimiento = (data) => {
  console.log("Ver movimiento", data);
};

const editarMovimiento = (data) => {
  console.log("Editar movimiento", data);
};

const eliminarMovimiento = (data) => {
  console.log("Eliminar movimiento", data);
};
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="col-span-1 p-4 overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold flex items-center gap-2">
          <i class="pi pi-list"></i>
          Últimos movimientos
        </h3>
      </div>
      <DataTable
        :value="movimientos"
        responsiveLayout="scroll"
        :paginator="true"
        :rows="10"
        sortField="fecha"
        :sortOrder="-1"
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
                {{ data.categoria?.categoria }} ·
                {{ data.subcategoria?.subcategoria || "—" }}
              </span>
            </div>
          </template>
        </Column>

        <Column header="Monto" class="text-right" sortable field="fecha">
          <template #body="{data}">
            <div class="flex flex-col items-end">
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

        <Column header="Acciones" class="text-center w-[8rem]">
          <template #body="{data}">
            <div class="flex justify-center gap-3">
              <Icon
                icon="ion:eye-outline"
                class="w-6 h-6 cursor-pointer hover:text-blue-700 transition-colors"
                @click="verMovimiento(data)"
              />
              <Icon
                icon="ion:create-outline"
                class="w-6 h-6 cursor-pointer hover:text-yellow-700 transition-colors"
                @click="editarMovimiento(data)"
              />
              <Icon
                icon="ion:trash-outline"
                class="w-6 h-6 cursor-pointer hover:text-red-700 transition-colors"
                @click="eliminarMovimiento(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <!-- Espacio reservado para la derecha en pantallas grandes -->
    <div class="hidden lg:block col-span-1"></div>
  </div>
</template>
