<template>
  <nav>
    <!-- logo -->
    <div>
      <router-link to="/">
        <img :src="logo" alt="Icono de la aplicación" class="app-logo" />
      </router-link>
    </div>

    <!-- menu -->
    <div>
      <!-- <router-link to="/">Inicio</router-link> -->
      <!-- Comentado ya que el incio es el clik en el logo no en 'inicio' aun que valga la rebundacia-->
      <router-link to="/dashboard">Panel de Control</router-link>
      <router-link to="/NewMov">Nuevos Movimientos</router-link>
      <router-link to="/Document">Documentacion</router-link>
    </div>

    <!-- inicio de sesión -->
    <div>
      <a href="/auth/google" aria-label="Iniciar sesión con Google">
        <i class="fi fi-brands-google" alt="Google"></i>
      </a>
    </div>
  </nav>
</template>

<script>
import logo from "@/assets/img/MonyMontySinFondo3.png";
export default {
  name: "Navegacion de la web",
  data() {
    return {
      logo,
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
  background-color: var(--color-fondo-nav); /* Color de fondo de la barra de navegación */
  padding: 0.3em 0.4em; /* Espaciado interno */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Sombra para dar profundidad */
}

nav div {
  display: flex;
  align-items: center; /* Alinear verticalmente los elementos dentro del div */
}

nav a,
nav router-link {
  color: var(--texto-primario); /* Color del texto de los enlaces */
  text-decoration: none; /* Eliminar subrayado de los enlaces */
  padding: 0.5em 0.3em; /* Espaciado alrededor del texto */
  border-radius: 5px; /* Bordes redondeados */
  transition:
    background-color 0.3s,
    color 0.3s; /* Transiciones suaves */
}

nav a:hover,
nav router-link:hover {
  background-color: var(--color-fondo-hover); /* Color de fondo al pasar el mouse */
  color: var(--color-letra-seleccion); /* Color del texto al pasar el mouse */
}

.app-logo {
  max-width: auto; /* Asegura que la imagen no exceda el ancho del contenedor */
  height: 3em; /* Mantiene la proporción de la imagen */
}
</style>
