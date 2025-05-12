<script>
import facebook from "@/assets/img/icon-facebook.svg";
import git from "@/assets/img/icon-git.svg";
import instagram from "@/assets/img/icon-instagram.svg";

export default {
  name: "Pie de página -- Web",
  data() {
    return {
      facebook, git, instagram

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

<template>
  <!-- pie de página -->
  <footer>
    <h3>¡Sé parte de esta transformación!</h3>
    <div class="pie">
      <div class="network">
        <h4 class="network-h4">Contactanos</h4>
        <p class="network-p">Síguenos en redes sociales</p>
        <div class="network-card">
          <div class="icon-network">
            <a href="https://facebook.com" aria-label="Facebook">
              <img :src="facebook" alt="Icono de la aplicación" class="network-icon" />
            </a>
          </div>
          <div class="icon-network">
            <a href="https://twitter.com" aria-label="Twitter">
              <img :src="git" alt="Icono de la aplicación" class="network-icon" />
            </a>

          </div>
          <div class="icon-network">
            <a href="https://instagram.com" aria-label="Instagram">
              <img :src="instagram" alt="Icono de la aplicación" class="network-icon" />
            </a>
          </div>
        </div>
      </div>

      <div class="paginas">
        <h4 class="paginas-h4">Páginas</h4>
        <p class="paginas-p">Puedes encontrar más de nosotros en:</p>

        <ul>
          <li>
            <router-link to="/dashboard">Dashboard</router-link>
          </li>
          <li>
            <router-link to="/NewMov">New Mov</router-link>
          </li>
        </ul>
      </div>

      <div class="agenda">
        <h4 class="agenda-h4">Agenda tu cita</h4>
        <p class="agenda-p">Si quieres ser parte de nuestra comunidad, agenda tu cita y comienza a transformar tu vida financiera.</p>
        
        <form class="agenda-formulario" @submit.prevent="subscribe">
          <input class="p-2 rounded-l-full" placeholder="Tu correo electrónico" type="email" required />
          <button class="btn-suscribirse" type="submit">Suscribirse</button>
        </form>
      </div>
    </div>

    <p>&copy; 2025 MonyMonty</p>
  </footer>
</template>

<style>
footer {
  padding: 2em 0;
  background-color: var(--color-fondo-nav);
  text-align: center;
}

.pie {
  display: flex;
  justify-content: space-around;
  margin: 2em 0;
}

.pie div {
  max-width: 300px;
}

.pie h4 {
  margin-bottom: 0.5em;
}

.pie p {
  margin: 0.5em 0;
}

footer form {
  display: flex;
  justify-content: center;
}

footer input {
  flex: 1;
}

footer button {
  margin-left: 0.5em;
}

.network-card {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}


.icon-network {
  width: 30px;
}


.btn-suscribirse {
  background-color: #1877f2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid #1666cf;
  font-weight: bold;
  cursor: pointer;
}

/* Extra pequeño: móviles pequeños (xs) */
@media (max-width: 575.98px) {
  
.pie {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.network-h2{
  font-size: 8px;
}

.network-p{
  font-size: 11px;
}

.icon-network {
  width: 15px;
}

.paginas-p{
  font-size: 11px;
}

.agenda-p{
  font-size: 11px;
}
}

/* Pequeño: móviles medianos y grandes (sm) */
@media (min-width: 576px) and (max-width: 767.98px) {}

/* Mediano: tablets (md) */
@media (min-width: 768px) and (max-width: 991.98px) {}

/* Grande: laptops (lg) */
@media (min-width: 992px) and (max-width: 1199.98px) {}

/* Extra grande: pantallas grandes (xl) */
@media (min-width: 1200px) and (max-width: 1399.98px) {}

/* XXL: monitores muy grandes */
@media (min-width: 1400px) {}
</style>
