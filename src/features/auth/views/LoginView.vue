<script>
import {useAuth} from "../logic/useAuth.js";
import logo from "@/assets/img/MonyMontySinFondo3.png";
import InfoView from "@/features/auth/components/infoLogin.vue";
import CustomButton from "@/features/auth/components/CustomButton.vue";

export default {
  name: "Login",
  components: {
    InfoView,
    CustomButton,
  },
  setup() {
    const {login, loading, isAuthenticated} = useAuth();

    return {
      login,
      loading,
      isAuthenticated,
    };
  },
  data() {
    return {
      // variable del logo
      logo,

      // Variable para Mostrar error
      showErrorFlag: false,
      errorMessage: "",

      // Datos para el inicio de sesión
      username: "",
      password: "",
    };
  },
  methods: {
    // Validar campos
    validateFields() {
      if (!this.username.trim()) {
        this.showError("Por favor, ingresa tu correo electrónico.");
        return false;
      }

      if (!this.isValidEmail(this.username)) {
        this.showError("Por favor, ingresa un correo electrónico válido.");
        return false;
      }

      if (!this.password.trim()) {
        this.showError("Por favor, ingresa tu contraseña.");
        return false;
      }

      if (this.password.length < 6) {
        this.showError("La contraseña debe tener al menos 6 caracteres.");
        return false;
      }

      return true;
    },

    // Validar formato de email
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // Manejo del login
    async handleLogin() {
      if (!this.validateFields()) {
        return;
      }

      const credentials = {
        email: this.username.trim(),
        password: this.password,
      };

      try {
        const result = await this.login(credentials);

        if (result.success) {
          // Login exitoso, redirigir
          this.$router.push("/tablero");
        } else {
          // Mostrar error del servidor
          this.showError(result.error || "Error en el inicio de sesión");
        }
      } catch (error) {
        this.showError("Error de conexión. Inténtalo de nuevo.");
      }
    },

    // Mostrar error
    showError(message) {
      this.errorMessage = message;
      this.showErrorFlag = true;

      // Auto-ocultar error después de 5 segundos
      setTimeout(() => {
        this.hideError();
      }, 5000);
    },

    // Ocultar error
    hideError() {
      this.showErrorFlag = false;
      this.errorMessage = "";
    },

    // Redirecciones
    redirectToDashboard() {
      if (this.isAuthenticated) {
        this.$router.push("/tablero");
      } else {
        this.$router.push("/");
      }
    },

    redirectToRecuperarCuenta() {
      this.$router.push("/recuperarCuenta");
    },
  },

  // Verificar si ya está autenticado al montar el componente
  async mounted() {
    if (this.isAuthenticated) {
      this.$router.push("/tablero");
    }
  },
};
</script>

<template>
  <div class="login">
    <div class="login-container">
      <!-- Sección derecha -->
      <div class="login-card">
        <div class="login-form">
          <div>
            <img :src="logo" alt="Icono de la aplicación" class="login-logo" />
          </div>

          <div class="login-form-datos">
            <div class="input-group">
              <input
                type="email"
                v-model="username"
                placeholder=" "
                id="email"
                class="login-input"
                :disabled="loading"
                @focus="hideError"
              />
              <label for="email">Correo electrónico</label>
            </div>

            <div class="input-group">
              <input
                type="password"
                v-model="password"
                placeholder=" "
                id="password"
                class="login-input"
                :disabled="loading"
                @focus="hideError"
                @keyup.enter="handleLogin"
              />
              <label for="password">Contraseña</label>
            </div>

            <!-- Mostrar errores -->
            <p v-if="showError" class="login-error">{{ errorMessage }}</p>
          </div>

          <!-- Botón de login con estado de carga -->
          <CustomButton
            :label="loading ? 'Iniciando sesión...' : 'Iniciar Sesión'"
            :customClick="handleLogin"
            :disabled="loading"
            background="var(--color-fondo-button-blue)"
            text-color="var(--texto-primario-Blanco)"
          />

          <p @click="redirectToRecuperarCuenta" class="forgot-password">¿Olvidaste tu contraseña?</p>

          <div class="divider-buton"></div>

          <CustomButton
            label="Crear cuenta nueva"
            :to="'/crearCuenta'"
            :disabled="loading"
            background="var(--color-fondo-button-green)"
            text-color="var(--texto-primario-Blanco)"
          />

          <!-- Botón de prueba (remover en producción) -->
          <CustomButton
            label="tablero prueba"
            :customClick="redirectToDashboard"
            :disabled="loading"
            background="var(--color-fondo-button-green)"
            text-color="var(--texto-primario-Blanco)"
          />
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
  transition: all 0.2s ease;
}

.input-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  color: #dc3545;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: rgba(220, 53, 69, 0.1);
  border-left: 3px solid #dc3545;
  border-radius: 0.25rem;
}

.forgot-password {
  color: var(--texto-primario-azul);
  font-size: var(--font-size-botones);
  cursor: pointer;
  margin-bottom: 10px;
  transition: all 0.2s ease;
}

.forgot-password:hover {
  text-decoration: none;
  font-weight: bold;
  color: var(--texto-primario-azul-hover);
}

.divider-buton {
  width: 50%;
  height: 5px;
  margin: 15px 0;
  background-color: #e0e0e0;
}

.divider {
  width: 2px;
  height: 80%;
  background-color: #e0e0e0;
}

.login-mesaje {
  text-align: center;
  width: 100%;
  padding: 10px 0;
  font-size: 0.9em;
  color: #6c757d;
}

/* Responsive Design */
@media (max-width: 575.98px) {
  .login-container {
    flex-direction: column;
    width: 90%;
    height: auto;
    margin-top: 6rem;
    margin-bottom: 30px;
  }

  .login-card {
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

  .login-logo {
    max-width: 120px;
  }
}

/* Pequeño: móviles medianos y grandes (sm) */
@media (min-width: 576px) and (max-width: 767.98px) {
}

/* Mediano: tablets (md) */
@media (min-width: 768px) and (max-width: 991.98px) {
}

/* Grande: laptops (lg) */
@media (min-width: 992px) and (max-width: 1199.98px) {
}

/* Extra grande: pantallas grandes (xl) */
@media (min-width: 1200px) and (max-width: 1399.98px) {
}

/* XXL: monitores muy grandes */
@media (min-width: 1400px) {
}
</style>
