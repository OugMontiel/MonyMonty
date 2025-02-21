<template>
  <div id="app">
    <nav>
      <router-link to="/">dashboard</router-link>
      <router-link to="/NewMov">New Mov</router-link>
      <!-- Agrega más enlaces de navegación según tus rutas -->
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
/* Estilos para tu aplicación */
nav {
  display: flex;
  gap: 10px;
}
</style>