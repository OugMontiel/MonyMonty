<template>
  <div id="app">
    <Toast />
    <!-- contenido -->
    <router-view></router-view>
  </div>
</template>

<script>
import Toast from "primevue/toast";
export default {
  name: "App",
};
</script>

<style></style>
