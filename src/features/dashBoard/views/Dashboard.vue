<script setup>
import DashBoardCards from "../components/DashBoardCards.vue";
import DashBoardMovimientos from "../components/DashBoardMovimientos.vue";
import CategoriaRanking from "../components/CategoriaRanking.vue";
</script>

<template>
  <div class="w-full px-4 py-6 gap-4 flex flex-col">
    <!-- Grid de las Cards -->
    <DashBoardCards />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Tabla de Movimientos -->
      <div class="col-span-1 p-4 overflow-hidden">
        <DashBoardMovimientos />
      </div>
      <!-- Ranking Visual de Categorías -->
      <div class="hidden lg:block col-span-1">
        <CategoriaRanking />
      </div>
    </div>
  </div>
</template>
