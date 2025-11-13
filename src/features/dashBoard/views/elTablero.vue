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
