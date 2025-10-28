<script setup>
/**
 * ============================================================
 * Autor: Diego Alejandro Montiel Flórez
 * Proyecto: MonyMonty
 * Descripción: Este código es propiedad intelectual de
 * Diego Alejandro Montiel Flórez. Su uso, copia o distribución
 * sin autorización está estrictamente prohibido.
 * ============================================================
 */
import {ref, onMounted} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";

import {useAuth} from "../logic/useAuth.js";
import logo from "../../../assets/img/MonyMontySinFondo3.png";
import InfoView from "../components/infoLogin.vue";

const toast = useToast();
const router = useRouter();
const {login, loading, isAuthenticated} = useAuth();

const username = ref("");
const password = ref("");

// Función reutilizable para mostrar errores con Toast
const showError = (message) => {
  toast.add({
    severity: "error",
    summary: "Error",
    detail: message,
    life: 4000,
  });
};

// Validar campos
const validateFields = () => {
  if (!username.value.trim()) {
    showError("Por favor, ingresa tu correo electrónico.");
    return false;
  }

  if (!isValidEmail(username.value)) {
    showError("Por favor, ingresa un correo electrónico válido.");
    return false;
  }

  if (!password.value.trim()) {
    showError("Por favor, ingresa tu contraseña.");
    return false;
  }

  if (password.value.length < 6) {
    showError("La contraseña debe tener al menos 6 caracteres.");
    return false;
  }

  return true;
};

// Validar formato de email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Manejo del login
const handleLogin = async () => {
  console.log("✅ handleLogin ejecutado");

  if (!validateFields()) return;

  const credentials = {
    email: username.value.trim(),
    password: password.value,
  };

  try {
    const result = await login(credentials);

    if (result.success) {
      // Login exitoso, redirigir
      router.push("/tablero");
    } else {
      // Mostrar error del servidor
      showError(result.error || "Error en el inicio de sesión");
    }
  } catch (error) {
    showError("Error de conexión. Inténtalo de nuevo.");
  }
};

// Redirecciones
const redirectToDashboard = () => {
  if (isAuthenticated.value) {
    router.push("/tablero");
  } else {
    router.push("/");
  }
};

const redirectToRecuperarCuenta = () => {
  router.push("/recuperarCuenta");
};
const redirectToCrearCuenta = () => {
  router.push("/crearCuenta");
};

// Verificar si ya está autenticado al montar el componente
onMounted(() => {
  if (isAuthenticated.value) {
    router.push("/tablero");
  }
});
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
            <FloatLabel variant="on">
              <InputText id="email" type="email" v-model="username" :disabled="loading" />
              <label for="email">Correo electrónico</label>
            </FloatLabel>

            <FloatLabel variant="on">
              <Password
                id="password"
                type="password"
                v-model="password"
                :disabled="loading"
                @keyup.enter="handleLogin"
                toggleMask
                showClear
              />
              <label for="password">Contraseña</label>
            </FloatLabel>
          </div>

          <!-- Botón de login con estado de carga -->
          <!-- Botón de login -->
          <Button v-if="!loading" label="Iniciar Sesión" class="w-full" severity="primary" @click="handleLogin" />

          <Button v-else class="w-full flex justify-center" severity="primary" :loading="true" />

          <!-- Botón de crear cuenta -->
          <Button label="Crear Cuenta" class="w-full" severity="success" :disabled="loading" @click="redirectToCrearCuenta" />

          <!-- División -->
          <Button label="¿Olvidaste tu contraseña?" link @click="redirectToRecuperarCuenta" />
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
