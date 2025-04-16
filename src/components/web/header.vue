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
      <a href="#inicio">Inicio</a>
      <a href="#productos">Productos</a>
      <a href="#nosotros">Nosotros</a>
      <a href="#clientes">Clientes</a>
      <a href="#contacto">Contacto</a>
    </div>

    <!-- inicio de sesión -->

    <div>
      <router-link to="/login">Inicio de Sesión</router-link>
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

/* Estilo específico para el botón de inicio de sesión */
.login-button {
  background-color: var(--color-fondo-boton); /* Color de fondo del botón */
  color: var(--texto-primario); /* Color del texto del botón */
  padding: 0.5em 1em; /* Espaciado alrededor del texto del botón */
  border: none; /* Sin borde */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambia el cursor al pasar sobre el botón */
  transition:
    background-color 0.3s,
    color 0.3s; /* Transiciones suaves */
}

.login-button:hover {
  background-color: var(--color-fondo-hover); /* Color de fondo al pasar el mouse */
  color: var(--color-letra-seleccion); /* Color del texto al pasar el mouse */
}
</style>
