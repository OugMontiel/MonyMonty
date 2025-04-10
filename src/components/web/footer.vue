<template>
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
</template>
<script>
export default {
  name: "Pie de página -- Web",
  methods: {
    subscribe() {
      // Lógica para manejar la suscripción
      alert("Gracias por suscribirte!");
    },
  },
};
</script>

<style>
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
