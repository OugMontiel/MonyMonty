<script>
/**
 * ============================================================
 * Autor: Diego Alejandro Montiel Flórez
 * Proyecto: MonyMonty
 * Descripción: Este código es propiedad intelectual de
 * Diego Alejandro Montiel Flórez. Su uso, copia o distribución
 * sin autorización está estrictamente prohibido.
 * ============================================================
 */
import {useAuth} from "../logic/useAuth.js";
import logo from "../../../assets/img/MonyMontySinFondo3.png";
import InfoView from "../components/infoLogin.vue";
import CustomButton from "../components/CustomButton.vue";
import {useToast} from "primevue/usetoast";

export default {
  name: "Login",
  components: {
    InfoView,
    CustomButton,
  },
  setup() {
    const {login, loading, isAuthenticated} = useAuth();
    const toast = useToast();

    // Función reutilizable para mostrar errores con Toast
    const showError = (message) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 4000,
      });
    };

    return {
      login,
      loading,
      isAuthenticated,
      showError,
    };
  },
  data() {
    return {
      // variable del logo
      logo,
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
      if (!this.validateFields()) return;

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
    redirectToCrearCuenta() {
      this.$router.push("/crearCuenta");
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
    <div class="contentCentrado">
      <div class="login-container">
        <!-- Sección derecha -->
        <div class="login-card">
          <div>
            <img :src="logo" alt="Icono de la aplicación" class="login-logo" />
          </div>
          <div class="login-form">
            <div class="input-group">
              <input type="email" v-model="username" placeholder=" " id="email" class="login-input" :disabled="loading" />
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
                @keyup.enter="handleLogin"
              />
              <label for="password">Contraseña</label>
            </div>
          </div>

          <div class="login-button">
            <!-- Botón de login con estado de carga -->
            <CustomButton
              :label="loading ? 'Iniciando sesión...' : 'Iniciar Sesión'"
              :customClick="handleLogin"
              :disabled="loading"
              background="var(--color-fondo-button-blue)"
              text-color="var(--texto-primario-Blanco)"
            />

            <!-- Botón de crear cuenta -->
            <CustomButton
              label="Crear Cuenta"
              :customClick="redirectToCrearCuenta"
              :disabled="loading"
              background="var(--color-fondo-button-green)"
              text-color="var(--texto-primario-Blanco)"
            />

            <!-- División -->
            <p @click="redirectToRecuperarCuenta" class="forgot-password">¿Olvidaste tu contraseña?</p>
          </div>
        </div>

        <!-- División -->

        <!-- Sección izquierda -->
        <InfoView />
      </div>
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
}

.contentCentrado {
  flex: 1; /* ocupa todo el espacio disponible entre header y footer */
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  display: flex;
  justify-content: space-evenly;
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
  justify-content: space-evenly;
  align-items: center;
  padding: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: 1em;
}

.input-group {
  position: relative;
}

.input-group input {
  padding: 1rem 0.5rem 0.5rem 0.5rem;
  color: var(--texto-primario);
  font-size: var(--font-size-input);
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
  font-size: var(--font-size-text);
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

.login-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
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

.login-mesaje {
  text-align: center;
  width: 100%;
  padding: 10px 0;
  font-size: var(--font-size-text);
  color: var(--color-oscuro);
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
