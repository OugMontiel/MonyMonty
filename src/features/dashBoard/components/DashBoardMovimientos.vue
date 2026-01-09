<script setup>
defineProps({
  movimientos: {
    type: Array,
    default: () => [],
  },
});
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
      </DataTable>
    </div>
    <!-- Espacio reservado para la derecha en pantallas grandes -->
    <div class="hidden lg:block col-span-1"></div>
  </div>
</template>
