<script>
import logo from "@/assets/img/MonyMontySinFondo3.png";

export default {
  name: "WebNavBar",
  data() {
    return {
      logo,
    };
  },
   methods: {
    dirigirAInicio() {
      this.$router.push('/');
    },

  }
};
</script>

<template>
  <nav class="navbar">
    <!-- Logo -->
    <div class="navbar__logo">
      <router-link to="/">
        <img :src="logo" alt="Logo MonyMonty" class="navbar__logo-image" @click="dirigirAInicio()"  />
      </router-link>
    </div>

    <!-- Botón de inicio de sesión -->
    <div class="navbar__auth">
      <router-link to="/login" class="navbar__login-button">
        Iniciar Sesión
      </router-link>
    </div>
  </nav>
</template>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5em;
  background-color: var(--color-fondo-nav);
  padding: 0 1em;
  box-shadow: 0 2px 5px var(--color-fondo-shadow);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;

}

/* Logo */
.navbar__logo {
  display: flex;
  align-items: center;
}

.navbar__logo-image {
  height: 3em;
}

/* Login */

.navbar__auth {
  display: flex;
  align-items: center;
}

.navbar__login-button {
  background-color: var(--color-fondo-boton);
  color: var(--texto-primario);
  padding: 0.5em 1em;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;
}

.navbar__login-button:hover {
  background-color: var(--color-fondo-hover);
  color: var(--color-letra-seleccion);
}
</style>
