<script setup>
import DashBoardCards from "../components/DashBoardCards.vue";
import DashBoardMovimientos from "../components/DashBoardMovimientos.vue";
</script>

<template>
  <div class="w-full px-4 py-6 gap-4 flex flex-col">
    <!-- Grid de las Cards -->
    <DashBoardCards />

    <!-- Tabla de Movimientos -->
    <DashBoardMovimientos />
  </div>
</template>
