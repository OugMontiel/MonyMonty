<script setup>
import {ref} from "vue";

import HeaderView from "../components/tablero/header.vue";
import SidebarView from "../components/tablero/sidebar.vue";
import BackgroundView from "../components/dashBoardMovimiento/dashboardView.vue";

const drawerRef = ref(null);

const openDrawer = () => {
  if (drawerRef.value?.open) {
    drawerRef.value.open();
  } else {
    drawerRef.value.visible = true;
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <HeaderView @open-drawer="openDrawer" />

    <div class="flex flex-1">
      <!-- Sidebar -->
      <SidebarView ref="drawerRef" />

      <!-- Main Content / Background -->
      <main class="flex-1 relative">
        <BackgroundView />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
