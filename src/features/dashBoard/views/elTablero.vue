<script setup>
import HeaderView from "../components/tablero/header.vue";
import SidebarView from "../components/tablero/sidebar.vue";
import BackgroundView from "../components/dashBoardMovimiento/dashboardView.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <HeaderView />

    <div class="flex flex-1">
      <!-- Sidebar -->
      <SidebarView />

      <!-- Main Content / Background -->
      <main class="flex-1 relative">
        <BackgroundView />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
