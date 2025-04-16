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

<script>
import Header from "@/components/tablero/header.vue";
import Sidebar from "@/components/tablero/sidebar.vue";
import Footer from "@/components/tablero/footer.vue";
import Background from "@/views/Dashboard/dashboard.vue";

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
