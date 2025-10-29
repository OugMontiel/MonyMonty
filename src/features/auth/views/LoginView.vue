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
import {ref, onMounted, reactive} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {zodResolver} from "@primevue/forms/resolvers/zod";
import {z} from "zod";

import {useAuth} from "../logic/useAuth.js";
import logo from "../../../assets/img/MonyMontySinFondo3.png";
import InfoView from "../components/infoLogin.vue";

const toast = useToast();
const router = useRouter();
const {login, loading, isAuthenticated} = useAuth();

const submitted = ref(false);

// Esquema de validación con Zod
const resolver = zodResolver(
  z.object({
    email: z.string().min(1, {message: "Por favor, ingresa tu correo electrónico."}).email({message: "Correo electrónico no válido."}),
    password: z.string().min(8, {message: "La contraseña debe tener al menos 8 caracteres."}),
  })
);

// === SUBMIT DEL FORM ===
const onFormSubmit = async ({valid, values}) => {
  submitted.value = true;

  if (!valid) return;

  try {
    const result = await login({
      email: values.email.trim(),
      password: values.password,
    });

    if (result.success) {
      router.push("/tablero");
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: result.error || "Error en el inicio de sesión",
        life: 4000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error de conexión",
      detail: "Inténtalo de nuevo.",
      life: 4000,
    });
  }
};

// Redirecciones
const redirectToRecuperarCuenta = () => router.push("/recuperarCuenta");
const redirectToCrearCuenta = () => router.push("/crearCuenta");

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
          <!-- FORMULARIO PRIMEVUE -->
          <Form :resolver="resolver" @submit="onFormSubmit" class="login-form">
            <!-- EMAIL -->
            <FormField v-slot="$field" name="email" class="w-full flex flex-col items-center">
              <FloatLabel variant="on" class="w-full">
                <InputText id="email" type="email" v-bind="$field.props" :disabled="loading" class="w-full" />
                <label for="email">Correo electrónico</label>
              </FloatLabel>
              <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple">{{
                $field.error?.message
              }}</Message>
            </FormField>

            <!-- PASSWORD -->
            <FormField v-slot="$field" name="password" class="w-full flex flex-col items-center">
              <FloatLabel variant="on" class="w-full">
                <Password
                  id="password"
                  v-bind="$field.props"
                  :feedback="false"
                  toggleMask
                  :disabled="loading"
                  class="w-full"
                  inputClass="w-full"
                />
                <label for="password">Contraseña</label>
              </FloatLabel>
              <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple">{{
                $field.error?.message
              }}</Message>
            </FormField>

            <!-- BOTONES -->
            <Button type="submit" label="Iniciar Sesión" class="w-full" severity="primary" :loading="loading" />
          </Form>

          <Button label="Crear Cuenta" class="w-full" severity="success" :disabled="loading" @click="redirectToCrearCuenta" />

          <!-- Olvidaste tu contraseña -->
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
