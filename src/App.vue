<template>
  <div id="app">
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
      </div>

      <!-- inicio de sesión -->
      <div>
        <a href="/auth/google" aria-label="Iniciar sesión con Google">
          <i class="fi fi-brands-google" alt="Google"></i>
        </a>
      </div>
    </nav>

    <!-- contenido -->
    <router-view></router-view>

    <!-- pie de página -->
    <footer>
      <h3>¡Sé parte de esta transformación!</h3>
      <div class="pie">
        <div>
          <h4>Contacta</h4>
          <p>Síguenos en redes sociales</p>
          <div class="flex justify-center space-x-4 mt-4">
            <a href="https://facebook.com" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <div>
          <h4>Páginas</h4>
          <p>Puedes encontrar más de nosotros en:</p>
          <ul>
            <li>
              <router-link to="/dashboard">Dashboard</router-link>
            </li>
            <li>
              <router-link to="/NewMov">New Mov</router-link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Agenda tu cita</h4>
          <p>Si quieres ser parte de nuestra comunidad, agenda tu cita y comienza a transformar tu vida financiera.</p>
          <form class="mt-4" @submit.prevent="subscribe">
            <input class="p-2 rounded-l-full" placeholder="Tu correo electrónico" type="email" required />
            <button class="bg-yellow-500 text-gray-900 px-4 py-2 rounded-r-full" type="submit">Suscribirse</button>
          </form>
        </div>
      </div>

      <p>&copy; 2025 MonyMonty</p>
    </footer>
  </div>
</template>

<script>
import logo from "./assets/img/MonyMontySinFondo3.png";

export default {
  name: "App",
  data() {
    return {
      logo,
    };
  },
  methods: {
    subscribe() {
      // Lógica para manejar la suscripción
      alert("Gracias por suscribirte!");
    },
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

footer {
  padding: 2em 0; /* Espaciado interno del pie de página */
  background-color: var(--color-fondo-nav); /* Color de fondo del pie de página */
  text-align: center; /* Centrar el texto */
}

.pie {
  display: flex;
  justify-content: space-around; /* Espaciado entre las secciones del pie de página */
  margin: 2em 0; /* Margen superior e inferior */
}

.pie div {
  max-width: 300px; /* Limitar el ancho de cada sección */
}

.pie h4 {
  margin-bottom: 0.5em; /* Espaciado inferior para los encabezados */
}

.pie p {
  margin: 0.5em 0; /* Espaciado vertical para los párrafos */
}

footer form {
  display: flex; /* Usar flexbox para el formulario */
  justify-content: center; /* Centrar el contenido del formulario */
}

footer input {
  flex: 1; /* Permitir que el input ocupe el espacio disponible */
}

footer button {
  margin-left: 0.5em; /* Espaciado entre el input y el botón */
}
</style>
