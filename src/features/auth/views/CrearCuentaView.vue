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
import {ref, reactive, computed} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {Icon} from "@iconify/vue";
import {zodResolver} from "@primevue/forms/resolvers/zod";
import {z} from "zod";

import {useAuth} from "../logic/useAuth.js";
import logo from "../../../assets/img/MonyMontySinFondo3.png";

const toast = useToast();
const router = useRouter();
const {CrearUsuario, loading} = useAuth();

// Constantes
const submitted = ref(false);
const selectedPlanes = ref();
const planes = ref([
  {label: "Free", value: "free"},
  {label: "Basic", value: "basic"},
  {label: "Premium", value: "premium"},
]);
const selectedGenero = ref();
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
        .string()
        .min(1, {message: "Selecciona un género"})
        .refine((v) => ["Mujer", "Hombre"].includes(v), {
          message: "Opción no válida",
        }),
      plan: z
        .string()
        .min(1, {message: "Selecciona un plan"})
        .refine((v) => ["free", "basic", "premium"].includes(v), {
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
  <div class="form-container">
    <div class="card">
      <div class="logo-section">
        <img :src="logo" alt="Icono de la aplicación" class="logo-icon" />
      </div>
      <Form :resolver="resolver" @submit="onFormSubmit" :validate-on="['blur', 'input']" class="flex flex-col justify-around gap-4">
        <div class="flex gap-4">
          <FormField v-slot="$field" name="nombre" class="flex-1">
            <FloatLabel variant="on" class="w-full">
              <InputText id="nombre" v-bind="$field.props" class="w-full" :disabled="loading" />
              <label for="nombre">Nombre</label>
            </FloatLabel>
          </FormField>
          <FormField v-slot="$field" name="apellido" class="flex-1">
            <FloatLabel variant="on" class="w-full">
              <InputText id="apellido" v-bind="$field.props" class="w-full" :disabled="loading" />
              <label for="apellido">Apellido</label>
            </FloatLabel>
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
        </FormField>

        <div class="flex gap-4">
          <FormField v-slot="$field" name="plan" class="flex-1">
            <FloatLabel variant="on" class="w-full">
              <AutoComplete
                v-model="selectedPlanes"
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
          </FormField>
          <FormField v-slot="$field" name="genero" class="flex-1">
            <FloatLabel variant="on" class="w-full">
              <AutoComplete
                v-model="selectedGenero"
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
          </FormField>
        </div>

        <FormField v-slot="$field" name="email" class="w-full">
          <FloatLabel variant="on" class="w-full">
            <InputText id="email" type="email" v-bind="$field.props" class="w-full" :disabled="loading" />
            <label for="email">Correo electrónico</label>
          </FloatLabel>
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
              />
              <label for="password">Contraseña</label>
            </FloatLabel>
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
              />
              <label for="confirmPassword">Confirma tu contraseña</label>
            </FloatLabel>
          </FormField>
        </div>
        <Button type="submit" label="Registrarte" severity="primary" :loading="loading" />
      </Form>

      <Message severity="secondary" variant="simple" class="text-xs leading-snug">
        Al hacer clic en "Registrarte", aceptas nuestras
        <Button label="Condiciones" variant="text" @click="irACondiciones" size="small" />
        y
        <Button label="Política de privacidad" variant="text" @click="irAPrivacidad" size="small" />.
      </Message>

      <!--  Ya tienes Cuenta -->
      <Button label="¿Ya tienes una cuenta?" link @click="irALogin" :disabled="loading" />
    </div>
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
  justify-content: center;
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
  gap: 0.3rem;
}

/* ---Nombre y apellido--- */
.user-section {
  display: flex;
  gap: 1rem; /* Espacio entre inputs */
  justify-content: center;
}

.user-section div {
  display: flex;
  flex-direction: column;
}

.user-section input {
  flex: 1; /* Ambos inputs ocupan el mismo ancho */
  padding: 0.5rem; /* Espacio interior */
  border: 1px solid var(--color-border-input);
  border-radius: var(--border-radius-input);
  font-size: var(--font-size-input);
  outline: none; /* Quita borde azul fuerte */
  transition: border-color 0.2s ease;
}

.user-section input:focus {
  border-color: var(--color-border-input-activo); /* Color al enfocar */
}

/* Estilos para la sección de fecha de nacimiento */

.nacimiento-section {
  display: flex;
  flex-direction: column;
}

/* Estilos para la sección de género */

.genero-section {
  display: flex;
  flex-direction: column;
}

/* Estilo de Genero */

.genero-toggle {
  position: relative;
  display: inline-flex;
  width: 8em;
  border-radius: 30px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.genero-toggle:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.genero-toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.genero-toggle label {
  flex: 1;
  display: flex;
  justify-content: center; /* Centra horizontal */
  align-items: center;
  padding: 0.7rem 0;
  z-index: 2;
  cursor: pointer;
  user-select: none;
  transition: color 0.3s ease;
}

.genero-toggle label:hover {
  color: #495057;
}

.genero-toggle label.active {
  color: var(--color-fondo-hover);
}

.genero-toggle .deslizante {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  border-radius: 30px;
  background: var(--color-fondo-button-green-activo);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.genero-toggle .deslizante.slide-right {
  transform: translateX(100%);
}

/* Mejora de accesibilidad con focus */
.genero-toggle input:focus-visible + label {
  outline-offset: 2px;
  border-radius: 30px;
}

/* ---Correo electrónico y contraseña--- */

/* Estilos para el texto pequeño */
.text-small {
  font-size: 10px;
  color: var(--texto-secundario);
}

/* botones de registrarse */

/* ---------- */

.register-button {
  background-color: #42b72a;
  color: white;
  width: 100%;
  padding: 13px;
  font-size: 20px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin: 5px 0;
}

.register-button:hover {
  border: 0.5px #1877f2 solid;
}

.text-condicionesypoliticas {
  font-size: 1em;
}

.forgot-login {
  color: #1877f2;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}

.forgot-login:hover {
  text-decoration: underline;
}

/* Extra pequeño: móviles pequeños (xs) */
@media (max-width: 575.98px) {
  .card {
    max-width: 270px;
    margin: 30px auto;
    background-color: #f3f3f3;
    padding: 1.5em;
    border: 1px solid #c5c1c1;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .register-button {
    background-color: #42b72a;
    color: white;
    width: 100%;
    padding: 7px;
    font-size: 14px;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin: 5px 0;
  }

  .register-button:hover {
    border: 0.5px #1877f2 solid;
  }

  .forgot-login {
    color: #1877f2;
    font-size: 10px;
    cursor: pointer;
    margin-bottom: 10px;
    text-align: center;
  }

  .forgot-login:hover {
    text-decoration: underline;
  }

  .footer-p {
    font-style: italic;
    font-size: 15px;
    color: #333;
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
