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
import {ref} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {zodResolver} from "@primevue/forms/resolvers/zod";
import {z} from "zod";

import {useAuth} from "../logic/useAuth.js";
import logo from "../../../assets/img/MonyMontySinFondo3.png";
import FooterAuth from "../components/FooterAuth.vue";

const toast = useToast();
const router = useRouter();
const {CrearUsuario, loading} = useAuth();

// Constantes
const submitted = ref(false);
const planes = ref([
  {label: "Free", value: "Free"},
  {label: "Basic", value: "Basic"},
  {label: "Premium", value: "Premium"},
]);
const generos = ref([
  {label: "Mujer", value: "Mujer"},
  {label: "Hombre", value: "Hombre"},
]);

// variables para los selects
const fechaMinima = new Date();
fechaMinima.setFullYear(fechaMinima.getFullYear() - 18);

// Esquema de validación con Zod
const resolver = zodResolver(
  z
    .object({
      nombre: z.string().trim().min(1, {message: "El nombre es obligatorio"}).min(3, {message: "Debe tener al menos 3 caracteres"}),
      apellido: z.string().trim().min(1, {message: "El apellido es obligatorio"}).min(3, {message: "Debe tener al menos 3 caracteres"}),
      email: z.string().trim().min(1, {message: "El email es obligatorio"}).email({message: "Formato de email inválido"}),
      password: z
        .string()
        .min(8, {message: "Debe tener al menos 8 caracteres"})
        .refine((v) => /[A-Z]/.test(v), {message: "Debe contener al menos una mayúscula"})
        .refine((v) => /\d/.test(v), {message: "Debe contener al menos un número"})
        .refine((v) => /[!@#$%^&*()_\-+=<>?{}[\]~]/.test(v), {
          message: "Debe contener al menos un símbolo",
        }),
      confirmPassword: z.string().min(1, {message: "Confirma tu contraseña"}),
      fechaNacimiento: z
        .date({
          required_error: "La fecha es obligatoria",
          invalid_type_error: "Selecciona una fecha válida",
        })
        .max(fechaMinima, {message: "Debes ser mayor de 18 años"}),
      genero: z
        .object({
          label: z.string(),
          value: z.string(),
        })
        .refine((v) => ["Mujer", "Hombre"].includes(v.value), {
          message: "Opción no válida",
        }),
      plan: z
        .object({
          label: z.string(),
          value: z.string(),
        })
        .refine((v) => ["Free", "Basic", "Premium"].includes(v.value), {
          message: "Opción no válida",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    })
);

// === SUBMIT DEL FORM ===
const onFormSubmit = async ({valid, values}) => {
  submitted.value = true;

  if (!valid) return;

  try {
    const result = await CrearUsuario({
      nombre: values.nombre.trim(),
      apellido: values.apellido.trim(),
      fechaNacimiento: values.fechaNacimiento,
      genero: values.genero,
      email: values.email.trim(),
      password: values.password,
      plan: values.plan,
    });

    if (result.success) {
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: result.message || "Se ha creado el Usuario.",
        life: 3000,
      });
      irALogin();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: result.error || "Error en Crear Cuenta",
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

const irALogin = () => router.push("/");
const irAPrivacidad = () => router.push("/privacidad");
const irACondiciones = () => router.push("/condiciones");
</script>

<template>
  <div class="form-container p-4">
    <div class="flex justify-center items-center flex-1">
      <div class="card">
        <div class="logo-section">
          <img :src="logo" alt="Icono de la aplicación" class="logo-icon" />
        </div>
        <div class="p-1">
          <div class="flex justify-center">
            <Message severity="contrast" variant="simple" size="large"> Crea tu cuenta </Message>
          </div>
        </div>
        <Form :resolver="resolver" @submit="onFormSubmit" :validate-on="['blur', 'input']" class="flex flex-col justify-around gap-4">
          <div class="flex gap-4">
            <FormField v-slot="$field" name="nombre" class="flex-1">
              <FloatLabel variant="on" class="w-full">
                <InputText id="nombre" v-bind="$field.props" class="w-full" :disabled="loading" />
                <label for="nombre">Nombre</label>
              </FloatLabel>
              <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple">{{
                $field.error?.message
              }}</Message>
            </FormField>
            <FormField v-slot="$field" name="apellido" class="flex-1">
              <FloatLabel variant="on" class="w-full">
                <InputText id="apellido" v-bind="$field.props" class="w-full" :disabled="loading" />
                <label for="apellido">Apellido</label>
              </FloatLabel>
              <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple">{{
                $field.error?.message
              }}</Message>
            </FormField>
          </div>

          <FormField v-slot="$field" name="fechaNacimiento" class="w-full">
            <FloatLabel variant="on" class="w-full">
              <DatePicker
                id="fechaNacimiento"
                v-bind="$field.props"
                :max-date="new Date()"
                date-format="yy-mm-dd"
                show-icon
                class="w-full"
                input-class="w-full"
                :disabled="loading"
              />
              <label for="fechaNacimiento">Fecha de nacimiento</label>
            </FloatLabel>
            <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>

          <div class="flex gap-4">
            <FormField v-slot="$field" name="plan" class="flex-1">
              <FloatLabel variant="on" class="w-full">
                <AutoComplete
                  v-bind="$field.props"
                  :suggestions="planes"
                  optionLabel="label"
                  optionValue="value"
                  dropdown
                  :disabled="loading"
                  class="w-full"
                />
                <label for="plan">Selecciona un plan</label>
              </FloatLabel>
              <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple">{{
                $field.error?.message
              }}</Message>
            </FormField>
            <FormField v-slot="$field" name="genero" class="flex-1">
              <FloatLabel variant="on" class="w-full">
                <AutoComplete
                  v-bind="$field.props"
                  :suggestions="generos"
                  optionLabel="label"
                  optionValue="value"
                  dropdown
                  :disabled="loading"
                  class="w-full"
                />
                <label for="genero">Selecciona un género</label>
              </FloatLabel>
              <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple">{{
                $field.error?.message
              }}</Message>
            </FormField>
          </div>

          <FormField v-slot="$field" name="email" class="w-full">
            <FloatLabel variant="on" class="w-full">
              <InputText id="email" type="email" v-bind="$field.props" class="w-full" :disabled="loading" />
              <label for="email">Correo electrónico</label>
            </FloatLabel>
            <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>

          <div class="flex gap-4">
            <FormField v-slot="$field" name="password" class="flex-1">
              <FloatLabel variant="on" class="w-full">
                <Password
                  id="password"
                  v-bind="$field.props"
                  :feedback="false"
                  toggleMask
                  class="w-full"
                  inputClass="w-full"
                  :disabled="loading"
                  @blur="$field.onBlur"
                  @input="$field.onChange"
                />
                <label for="password">Contraseña</label>
              </FloatLabel>
              <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple">{{
                $field.error?.message
              }}</Message>
            </FormField>
            <FormField v-slot="$field" name="confirmPassword" class="flex-1">
              <FloatLabel variant="on" class="w-full">
                <Password
                  id="confirmPassword"
                  v-bind="$field.props"
                  :feedback="false"
                  toggleMask
                  class="w-full"
                  inputClass="w-full"
                  :disabled="loading"
                  @blur="$field.onBlur"
                  @input="$field.onChange"
                />
                <label for="confirmPassword">Confirma tu contraseña</label>
              </FloatLabel>
              <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple">{{
                $field.error?.message
              }}</Message>
            </FormField>
          </div>
          <Button type="submit" label="Registrarte" severity="primary" :loading="loading" />
        </Form>

        <Message severity="secondary" variant="simple" class="text-xs leading-snug">
          Al hacer clic en "Registrarte", aceptas nuestros
          <Button label="Términos y Condiciones" variant="text" @click="irACondiciones" size="small" />
          y nuestra
          <Button label="Política de Privacidad" variant="text" @click="irAPrivacidad" size="small" />.
        </Message>

        <!--  Ya tienes Cuenta -->
        <Button label="¿Ya tienes una cuenta?" link @click="irALogin" :disabled="loading" />
      </div>
    </div>

    <FooterAuth />
  </div>
</template>

<style scoped>
/* ---Logo--- */

.logo-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em 0;
}

.logo-icon {
  width: clamp(5rem, 10vw, 13rem);
}

/* ---Ajuste General--- */

.form-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  width: 100%;
  color: #000; /* Color de texto predeterminado */
}

.card {
  background: var(--color-fondo);
  border-radius: var(--border-radius-card);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Extra pequeño: móviles pequeños (xs) */
@media (max-width: 575.98px) {
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
