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
const {recuperarCuenta, loading} = useAuth();

const submitted = ref(false);

// Esquema de validación con Zod
const resolver = zodResolver(
  z.object({
    email: z.string().min(1, {message: "Por favor, ingresa tu correo electrónico."}).email({message: "Correo electrónico no válido."}),
  })
);

// === SUBMIT DEL FORM ===
const onFormSubmit = async ({valid, values}) => {
  submitted.value = true;

  if (!valid) return;

  try {
    const result = await recuperarCuenta({
      email: values.email.trim(),
    });

    if (result.success) {
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: result.message || "Se ha enviado un correo para recuperar tu cuenta.",
        life: 3000,
      });
      irALogin();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: result.error || "Error al recuperar la cuenta",
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
        <div class="flex justify-center pt-6 pb-2">
          <img :src="logo" alt="Icono de la aplicación" class="h-16 object-contain login-logo" />
        </div>

        <div>
          <div class="flex justify-center">
            <Message severity="contrast" variant="simple" size="large"> Recupera tu cuenta </Message>
          </div>

          <Message severity="secondary" variant="simple">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar el acceso a tu cuenta.
          </Message>
        </div>

        <!-- FORMULARIO PRIMEVUE -->
        <Form :resolver="resolver" @submit="onFormSubmit" class="flex flex-col justify-around gap-4">
          <!-- EMAIL -->
          <FormField v-slot="$field" name="email" class="w-full">
            <FloatLabel variant="on" class="w-full">
              <InputText id="email" type="email" v-bind="$field.props" :disabled="loading" class="w-full" />
              <label for="email">Correo electrónico</label>
            </FloatLabel>
            <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple" class="mt-2">
              {{ $field.error?.message }}
            </Message>
          </FormField>

          <!-- BOTONES -->
          <div class="flex flex-col gap-2 pt-2">
            <Button type="submit" label="Recuperar cuenta" severity="primary" :loading="loading" class="w-full" />
            <Button label="Volver al inicio" link :disabled="loading" @click="irALogin" outlined class="w-full" />
          </div>
        </Form>
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
