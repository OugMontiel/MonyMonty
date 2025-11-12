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
import FooterAuth from "../components/FooterAuth.vue";

const toast = useToast();
const router = useRouter();
const {verificacionTocken, CambiodeClave, loading} = useAuth();

const submitted = ref(false);
const loadingUser = ref(false);
const user = ref({});

onMounted(async () => {
  try {
    const params = new URLSearchParams(window?.location?.search);
    const token = params.get("token");

    if (!token) {
      toast.add({
        severity: "error",
        summary: "Error en token",
        detail: "Tocken es Requerido.",
        life: 4000,
      });
      return;
    }

    const result = await verificacionTocken({
      token,
    });

    if (result.success) {
      toast.add({
        severity: "success",
        summary: "Tocken Verificado",
        detail: result?.message,
        life: 3000,
      });
      user.value = result?.data?.userDelTocken;
      loadingUser.value = true;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: result?.error || "Error al verificar el Tocken",
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
});

// Esquema de validación con Zod
const resolver = zodResolver(
  z
    .object({
      email: z.string().min(1, {message: "Por favor, ingresa tu correo electrónico."}).email({message: "Correo electrónico no válido."}),
      password: z
        .string()
        .min(8, {message: "Debe tener al menos 8 caracteres"})
        .refine((v) => /[A-Z]/.test(v), {message: "Debe contener al menos una mayúscula"})
        .refine((v) => /\d/.test(v), {message: "Debe contener al menos un número"})
        .refine((v) => /[!@#$%^&*()_\-+=<>?{}[\]~]/.test(v), {
          message: "Debe contener al menos un símbolo",
        }),
      confirmPassword: z.string().min(1, {message: "Confirma tu contraseña"}),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    })
);

// === SUBMIT DEL FORM ===
const onFormSubmit = async ({valid, values}) => {
  submitted.value = true;

  if (!loadingUser) return;
  if (!valid) return;

  try {
    const result = await CambiodeClave({
      email: values.email.trim(),
      password: values.password,
      confirmPassword: values.confirmPassword,
    });

    if (result.success) {
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: result.message,
        life: 3000,
      });
      irALogin();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: result.error || "Error al cambiar la contraseña",
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

const irALogin = () => router.push("/");
</script>

<template>
  <div class="flex flex-col justify-between items-center min-h-screen p-4">
    <div class="flex justify-center items-center flex-1">
      <div class="flex flex-col max-w-md shadow-lg p-4 gap-4">
        <!-- LOGO -->
        <div class="flex justify-center pt-6 pb-2">
          <img :src="logo" alt="Icono de la aplicación" class="h-16 object-contain login-logo" />
        </div>

        <!-- Si hay data disponible -->
        <template v-if="loadingUser">
          <!-- MENSAJES SUPERIORES -->
          <div>
            <div class="flex justify-center">
              <Message severity="contrast" variant="simple" size="large"> Restablece tu contraseña </Message>
            </div>

            <div class="flex justify-center">
              <Message severity="secondary" variant="simple" class="p-4 text-lg">
                <p class="mb-1">Estás recuperando el acceso a la cuenta:</p>
                <p class="font-semibold text-xl">{{ user?.nombre }} ({{ user?.email }})</p>
              </Message>
            </div>
          </div>

          <!-- FORMULARIO PRIMEVUE -->
          <Form :resolver="resolver" @submit="onFormSubmit" class="flex flex-col justify-around gap-4">
            <!-- NUEVA CONTRASEÑA -->
            <FormField v-slot="$field" name="password" class="w-full">
              <FloatLabel variant="on" class="w-full">
                <Password id="password" v-bind="$field.props" :feedback="false" :disabled="loading" toggleMask class="w-full" />
                <label for="password">Nueva contraseña</label>
              </FloatLabel>
              <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple" class="mt-2">
                {{ $field.error?.message }}
              </Message>
            </FormField>

            <!-- CONFIRMAR CONTRASEÑA -->
            <FormField v-slot="$field" name="confirmPassword" class="w-full">
              <FloatLabel variant="on" class="w-full">
                <Password id="confirmPassword" v-bind="$field.props" :feedback="false" :disabled="loading" toggleMask class="w-full" />
                <label for="confirmPassword">Confirmar contraseña</label>
              </FloatLabel>
              <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple" class="mt-2">
                {{ $field.error?.message }}
              </Message>
            </FormField>

            <!-- BOTONES -->
            <div class="flex flex-col gap-2 pt-2">
              <Button type="submit" label="Actualizar contraseña" severity="primary" :loading="loading" class="w-full" />
              <Button label="Volver al inicio" link :disabled="loading" @click="irALogin" outlined class="w-full" />
            </div>
          </Form>
        </template>

        <!-- Si NO hay data disponible -->
        <template v-else>
          <div class="flex flex-col justify-center items-center text-center p-8 gap-4">
            <Message severity="warn" variant="simple" size="large"> El enlace de recuperación no es válido o ha expirado. </Message>
            <Button label="Volver al inicio" @click="irALogin" outlined />
          </div>
        </template>
      </div>
    </div>

    <FooterAuth class="mt-8" />
  </div>
</template>

<style scoped>
/* Sección derecha */
.login-logo {
  max-width: 9rem;
}

/* Asegura que el card tenga buen espaciado en móviles */
:deep(.p-card-body) {
  padding: 0;
}

:deep(.p-card-content) {
  padding-top: 0;
}

/* Mejora la apariencia del título */
:deep(.p-card-title) {
  padding: 0 1.5rem;
  margin-bottom: 0;
}

:deep(.p-card-subtitle) {
  padding: 0 1.5rem 1rem;
  line-height: 1.5;
}
</style>
