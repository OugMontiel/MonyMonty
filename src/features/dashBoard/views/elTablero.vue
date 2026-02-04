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
  <div class="flex min-h-screen relative">
    <!-- Sidebar (Left) -->
    <SidebarView ref="sidebarRef" />

    <!-- Main Column (Right) - Header + Content -->
    <div class="flex flex-col flex-1 min-w-0 transition-all duration-300">
      <!-- Header -->
      <HeaderView @toggle-menu="toggleSidebar" />

      <!-- Main Content -->
      <div class="flex flex-1 relative">
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
  </div>
</template>

<style scoped></style>
