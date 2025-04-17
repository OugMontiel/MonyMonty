<script>
import Header from "@/components/dashBoard/tablero/header.vue";
import Sidebar from "@/components/dashBoard/tablero/sidebar.vue";
import Footer from "@/components/dashBoard/tablero/footer.vue";
import Background from "@/components/dashBoard/dashboard.vue";

export default {
  name: "ElTablero",
  components: {
    Header,
    Sidebar,
    Footer,
    Background,
  },
};
</script>

<template>
  <div class="el-tablero">
    <Header />
    <div class="main-layout">
      <Sidebar />
      <div class="content">
        <Background />
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.el-tablero {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-layout {
  display: flex;
  flex: 1;
}

.content {
  flex: 1;
  overflow: auto;
}
</style>
