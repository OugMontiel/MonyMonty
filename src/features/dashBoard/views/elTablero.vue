<script>
import HeaderView from "@/features/dashBoard/components/tablero/header.vue";
import SidebarView from "@/features/dashBoard/components/tablero/sidebar.vue";
import FooterView from "@/features/dashBoard/components/tablero/footer.vue";
import BackgroundView from "@/features/dashBoard/components/dashBoardMovimiento/dashboardView.vue";

export default {
  name: "ElTablero",
  components: {
    HeaderView,
    SidebarView,
    FooterView,
    BackgroundView,
  },
};
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <HeaderView />
    
    <!-- Main Layout: Sidebar + Content -->
    <div class="flex flex-1 min-h-0">
      <!-- Sidebar -->
      <SidebarView />
      
      <!-- Main Content Area -->
      <div class="flex-1 overflow-auto bg-gray-50">
        <BackgroundView />
      </div>
    </div>
    
    <!-- Footer -->
    <FooterView />
  </div>
</template>

<style scoped>
/* Solo estilos que no se pueden lograr con Tailwind o personalizaciones específicas */
</style>