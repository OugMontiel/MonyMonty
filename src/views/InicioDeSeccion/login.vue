<template>
  <div class="login">
    <h1>Inicio de Sesión</h1>
    <button @click="redirectToDashboard">Iniciar Sesión</button>
  </div>
</template>

<script>
export default {
  name: "Login",
  methods: {
    redirectToDashboard() {
      this.$router.push({name: "Dashboard"});
    },
  },
};
</script>

<style scoped>
.login {
  text-align: center;
  margin-top: 50px;
}
</style>
