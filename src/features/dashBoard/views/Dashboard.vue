<script setup>
import {onMounted} from "vue";

import DashBoardCards from "../components/DashBoardCards.vue";
import DashBoardMovimientos from "../components/DashBoardMovimientos.vue";
import DashBoardTransferencias from "../components/DashBoardTransferencias.vue";
import CategoriaRanking from "../components/CategoriaRanking.vue";
import DashboardFilters from "../components/DashboardFilters.vue";

import {dataDashBoardStore} from "../../../stores/contexto/dataDashBoardStore";

// Stores
const storeData = dataDashBoardStore()

onMounted(() => {
  storeData.fetchAll();
});
</script>

<template>
  <div class="w-full px-4 py-6 gap-4 flex flex-col">
    <!-- Filtros Globales -->
    <DashboardFilters />

    <!-- Grid de las Cards -->
    <DashBoardCards />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Tabla de Movimientos y Transferencias -->
      <div class="col-span-1 p-4 overflow-hidden flex flex-col gap-6">
        <DashBoardMovimientos />
        <DashBoardTransferencias />
      </div>
      <!-- Ranking Visual de Categorías -->
      <div class="col-span-1">
        <CategoriaRanking />
      </div>
    </div>
  </div>
</template>
