<template>
  <div id="app">
    <nav>
      <div>
        <router-link to="/">
          <img :src="logo" alt="Icono de la aplicación" class="app-logo" />
        </router-link>
      </div>
      <div>
        <router-link to="/">Inicio</router-link>
        <router-link to="/dashboard">Panel de Control</router-link>
        <router-link to="/NewMov">Nuevos Movimientos</router-link>
      </div>
      <div>
        <!-- Envolver el icono en un router-link -->
        <a href="/auth/google">
          <i class="fi fi-brands-google" alt="Google"></i>
        </a>
      </div>

      <!-- Agrega más enlaces de navegación según tus rutas -->
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import logo from './assets/img/MonyMontySinFondo2.png';

export default {
  name: "App",
  data() {
    return {
      logo
    };
  },
};
</script>

<style>
/* Estilos para tu aplicación */
nav {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Alinear verticalmente los elementos */
  height: 4em;
  background-color:var(--color-fondo-nav); /* Color de fondo de la barra de navegación */
  padding: .3em .4em; /* Espaciado interno */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Sombra para dar profundidad */
}

nav div {
  display: flex;
  align-items: center; /* Alinear verticalmente los elementos dentro del div */
}

nav a, nav router-link {
  color: var(--texto-primario); /* Color del texto de los enlaces */
  text-decoration: none; /* Eliminar subrayado de los enlaces */
  padding: 0.5em 0.3em ; /* Espaciado alrededor del texto */
  border-radius: 5px; /* Bordes redondeados */
  transition: background-color 0.3s, color 0.3s; /* Transiciones suaves */
}

nav a:hover, nav router-link:hover {
  background-color: var(--color-fondo-hover); /* Color de fondo al pasar el mouse */
  color: var(--color-letra-seleccion); /* Color del texto al pasar el mouse */
}

.app-logo {
  
  max-width: auto; /* Asegura que la imagen no exceda el ancho del contenedor */
  height: 3em; /* Mantiene la proporción de la imagen */
  
}
</style>