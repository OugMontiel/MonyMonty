<script setup>
import {ref} from "vue";

import HeaderView from "../components/tablero/header.vue";
import SidebarView from "../components/tablero/sidebar.vue";
import FloatingMenu from "../../movimientos/components/FloatingMenu.vue";

const sidebarRef = ref(null);

const toggleSidebar = () => {
  if (sidebarRef.value) {
    sidebarRef.value.visible = !sidebarRef.value.visible;
  }
};
</script>

<template>
  <!-- Sidebar -->
  <SidebarView ref="sidebarRef" />
  
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <HeaderView @toggle-menu="toggleSidebar" />

    <div class="flex flex-1">

      <!-- Main Content / Background -->

      <main class="flex-1 relative">
        <router-view v-slot="{Component}">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
        
        <!-- Floating Action Button -->
        <FloatingMenu />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
