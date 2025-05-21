<script>
import logo from "@/assets/img/MonyMontySinFondo3.png";

import HeaderView from "@/features/auth/components/header.vue";
import InfoView from "@/features/auth/components/infoLogin.vue";

import CustomButton from "@/features/auth/components/CustomButton.vue";


export default {
  name: "Login",
  components: {
    HeaderView,
    InfoView,
    CustomButton,
  },
  data() {
    return {
      // variable del logo
      logo,

      // Variable para Mostrar error
      showError: false,

      // Datos para el inicio de sesión
      username: "",
      password: "",

    };
  },
  methods: {
    login() {
      if (this.username && this.password) {
        // Lógica para iniciar sesión
        console.log("Usuario:", this.username);
        console.log("Contraseña:", this.password);
        this.redirectToDashboard();
      } else {
        this.showError = true;
      }
    },
    hideError() {
      this.showError = false;
    },
    redirectToDashboard() {
      // Lógica para redirigir al dashboard
      alert("Redirigiendo al dashboard...");
      this.$router.push("/tablero");
    },
    redirectToRecuperarCuenta() {
      this.$router.push("/recuperarCuenta");
    },
    redirectToCrearCuenta() {
      this.$router.push("/crearCuenta");
    },
  },
};
</script>

<template>
  <div class="login">
    <HeaderView />
    <div class="login-container">
      <!-- Sección derecha -->
      <div class="login-card">
        <div class="login-form">
          <div>
            <img :src="logo" alt="Icono de la aplicación" class="login-logo" />
          </div>

          <div class="login-form-datos">
            <div class="input-group">
              <input type="email" v-model="username" placeholder=" " id="email" class="login-input"
                @focus="hideError" />
              <label for="email">Correo electrónico</label>
            </div>

            <div class="input-group">
              <input type="password" v-model="password" placeholder=" " id="password" class="login-input"
                @focus="hideError" />
              <label for="password">Contraseña</label>
            </div>

            <p v-if="showError" class="login-error">Por favor, completa todos los campos.</p>
          </div>

          <CustomButton label="Iniciar Sesion" :customClick="login" background="var(--color-fondo-button-blue)"
            text-color="var(--texto-primario-Blanco)" />

          <p @click="redirectToRecuperarCuenta" class="forgot-password">¿Olvidaste tu contraseña?</p>

          <div class="divider-buton"></div>

          <CustomButton label="Crear cuenta nueva" :to="'/crearCuenta'" background="var(--color-fondo-button-green)"
            text-color="var(--texto-primario-Blanco)" />

          <CustomButton label="tablero prueba" :customClick="redirectToDashboard"
            background="var(--color-fondo-button-green)" text-color="var(--texto-primario-Blanco)" />
        </div>
      </div>

      <div class="divider"></div>

      <!-- Sección izquierda -->
      <InfoView />
    </div>

    <!-- mensaje de pie de pagina -->
    <div class="login-mesaje">
      <p>"El dinero es un terrible amo pero un excelente sirviente." - P.T. Barnum</p>
    </div>
  </div>
</template>

<style scoped>
/* estilo general */

.login {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: var(--color-fondo-login);
  height: 100vh;
  font-family: sans-serif;
}

.login-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 70%;
  height: 60%;
  margin: auto;
  background: var(--color-fondo-login);
  border-radius: 0.5rem;
  box-shadow: 0 8px 30px var(--color-fondo-shadow);
}

/* Sección derecha */

.login-logo {
  max-width: 9rem;
}

.login-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90%;
  width: 35%;
  padding: 0.5rem;
  border-radius: 0.2rem;
  background: var(--color-fondo-login);
}

.login-form {
  height: 90%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.login-form-datos {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-group {
  position: relative;
  margin: 1rem 0;
}

.input-group input {
  width: 100%;
  padding: 1rem 0.5rem 0.5rem 0.5rem;
  font-size: 1rem;
  border: 1px solid var(--color-border-input);
  border-radius: 5px;
  outline: none;
}

.input-group label {
  position: absolute;
  top: 0.8rem;
  left: 0.5rem;
  color: var(--texto-primario);
  font-size: 1rem;
  pointer-events: none;
  transition: 0.2s ease all;
  
  padding: 0 0.25rem;
}

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label {
  top: -0.5rem;
  left: 0.4rem;
  font-size: 0.75rem;
  color: var(--texto-primario);
  background: var(--color-fondo-login);
}


.login-error {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.login-button {
  width: 100%;
  background: var(--color-fondo-button);
  color: var(--texto-primario-Blanco);
  border: none;
  padding: 0.8rem;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: var(--font-size-botones);
  border-radius: var(--border-radius-botones);
  cursor: pointer;
}

.login-button:hover {
  background: var(--color-fondo-button-activo);
}

.forgot-password {
  color: var(--texto-primario-azul);
  font-size: var(--font-size-botones);
  cursor: pointer;
  margin-bottom: 10px;
}

.forgot-password:hover {
  text-decoration: none;
  font-weight: bold;
  color: var(--texto-primario-azul-hover);
}

.create-button {
  width: 100%;
  background-color: #28a745;
  color: var(--texto-primario-Blanco);
  border: none;
  padding: 10px;
  font-weight: bold;
  font-size: var(--font-size-botones);
  border-radius: var(--border-radius-botones);
  cursor: pointer;
}

.create-button:hover {
  background-color: #36a420;
}


.login-mesaje {
  text-align: center;
  width: 100%;
  padding: 10px 0;
  font-size: 0.9em;
  color: #6c757d;
}


/* Extra pequeño: móviles pequeños (xs) */
@media (max-width: 575.98px) {
  .login-container {
    flex-direction: column;
    width: 90%;
    height: auto;
    margin-top: 6rem;
    margin-bottom: 30px;
  }

  .login-card,
  .login-info {
    width: 100%;
    height: auto;
    padding: 10px;
  }

  .login-form {
    width: 100%;
  }

  .login-form input {
    font-size: 14px;
  }

  .login-button,
  .create-button {
    font-size: 14px;
    padding: 8px;
  }

  .divider-buton {
    width: 50%;
    height: 5px;
    margin: 15px 0;
    background-color: #e0e0e0;
  }

  .divider {
    width: 100%;
    height: 2px;
    margin: 15px 0;
    background-color: #e0e0e0;
  }

  .login-info section {
    text-align: center;
    margin-bottom: 1rem;
  }

  .login-info h2,
  .info-p,
  .info-li {
    font-size: 12px;
  }

  .login-logo {
    max-width: 120px;
  }

  .login-footer {
    font-size: 12px;
    margin: auto;
    padding: 5px;
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
