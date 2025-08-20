<script>

import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";


export default {
  name: "Header",

  data() {
    return {
      profileName: "Nombre del Personaje",
      profileStatus: "Plan Premium",
      showMenu: false,
    };
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },

    goToProfile() {
      this.$router.push("/perfil");
    },

    logout() {
      localStorage.removeItem("token");
      // Redirige al login después de cerrar sesión
      this.$router.push("/login");
    }
  },
};
</script>

<template>
  <div class="profileBox">
    <div class="profileText">
      <h3 class="profileName">Nombre del Personaje</h3>
      <p class="profileStatus">Plan Premium</p>
    </div>
    <div class="profileImage" @click="toggleMenu">
      <img src="https://via.placeholder.com/40"  alt="Avatar" class="avatar" />
    </div>

    <div v-if="showMenu" class="dropdownMenu" @click.stop>
      <ul>
        <li @click="goToProfile">Editar perfil</li>
        <li @click="logout">Cerrar sesión</li>
      </ul>

    </div>
  </div>
</template>

<style scoped>
.profileBox {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.profileImage img.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}


.dropdownMenu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.dropdownMenu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdownMenu li {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdownMenu li:hover {
  background-color: #f0f0f0;
}

/* Extra pequeño: móviles pequeños (xs) */
@media (max-width: 575.98px) {
  /* Estilos para móviles pequeños */
}

/* Pequeño: móviles medianos y grandes (sm) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Estilos para móviles medianos/grandes */
}

/* Mediano: tablets (md) */
@media (min-width: 768px) and (max-width: 991.98px) {
  /* Estilos para tablets */
}

/* Grande: laptops (lg) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  /* Estilos para laptops */
}

/* Extra grande: pantallas grandes (xl) */
@media (min-width: 1200px) and (max-width: 1399.98px) {
  /* Estilos para pantallas grandes */
}

/* XXL: monitores muy grandes */
@media (min-width: 1400px) {
  /* Estilos para pantallas muy grandes */
}
</style>
