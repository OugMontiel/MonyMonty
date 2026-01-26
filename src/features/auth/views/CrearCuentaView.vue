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

import Checkbox from "primevue/checkbox";
import Drawer from "primevue/drawer";


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
        .refine((v) => ["Mujer", "Hombre", ""].includes(v.value), {
          message: "Opción no válida",
          path: ["genero"],
        }),
      plan: z
        .object({
          label: z.string(),
          value: z.string(),
        })
        .refine((v) => ["Free", "Basic", "Premium"].includes(v.value), {
          message: "Opción no válida",
        }),

      acceptLegal: z
        .object({
          value: z.boolean(),
        })
        .refine((data) => data.acceptLegal === true, {
          message: "Debes aceptar los términos y la política de privacidad para continuar",
          path: ["acceptLegal"],
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
      genero: values.genero.value,
      email: values.email.trim(),
      password: values.password,
      plan: values.plan.value.toLowerCase(),
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


// Controles de visibilidad (locales a esta vista)
const showPrivacidad   = ref(false)
const showCondiciones  = ref(false)

// Reemplaza las funciones de router por estas:
const abrirPrivacidad  = () => { showPrivacidad.value  = true }
const abrirCondiciones = () => { showCondiciones.value = true }

const cerrarTodo       = () => {
  showPrivacidad.value  = false
  showCondiciones.value = false
}

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
                <Select v-bind="$field.props" :options="planes" optionLabel="label" :disabled="loading" class="w-full" />
                <label for="plan">Selecciona un plan</label>
              </FloatLabel>
              <Message v-if="submitted && $field?.invalid" severity="error" size="small" variant="simple">{{
                $field.error?.message
              }}</Message>
            </FormField>
            <FormField v-slot="$field" name="genero" class="flex-1">
              <FloatLabel variant="on" class="w-full">
                <Select v-bind="$field.props" :options="generos" optionLabel="label" :disabled="loading" class="w-full" />
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

          <FormField v-slot="$field" name="acceptLegal" class="mt-2">
            <div class="flex items-start gap-2">
              <Checkbox
                v-model="$field.value"
                inputId="acceptLegal"
                :binary="true"
                 
                :disabled="loading"
                :invalid="submitted && $field?.invalid"
                @update:modelValue="$field.onChange"
              />
              <label for="acceptLegal" class="text-sm text-gray-600 dark:text-gray-400 leading-snug">
                Acepto los
                <button
                  type="button"
                  class="text-primary underline hover:text-primary-300 cursor-pointer transition"
                  @click="abrirCondiciones"
                >
                  Términos y Condiciones
                </button>
                y la
                <button
                  type="button"
                  class="text-primary underline hover:text-primary-700 cursor-pointer transition"
                  @click="abrirPrivacidad"
                >
                  Política de Privacidad
                </button>
                de MonyMonty.
              </label>
            </div>
          </FormField>

          <Button type="submit" label="Registrarte" severity="primary" :loading="loading" ></Button>
        </Form>

        <Button label="¿Ya tienes una cuenta?" link @click="irALogin" :disabled="loading" ></Button>
      </div>
    </div>

    <FooterAuth />
  </div>

  <!-- ──────────── Drawer Política de Privacidad ──────────── -->

  <drawer 
    v-model:visible="showPrivacidad" 
    position="full" 
    :modal="true" 
    :showCloseIcon="true" 
    :dismissable="true"
  >
    
    <div class="w-full max-w-8xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24">
       <!-- Encabezado -->
      <div class="text-center mb-10 md:mb-12">
        <h1 class="text-3xl md:text-4xl lg:text-5x1 font-bold text-gray-800">Política de Privacidad</h1>
        <p class="mt-3 text-gray-600 ">Última actualización: 24 de enero de 2026</p>
      </div>

      <!-- Contenido principal -->
      <div class="prose prose-lg prose-gray max-w-none text-justify">
        <p>
          En <strong>[Nombre de tu Empresa / Aplicación]</strong> (en adelante “nosotros”, “nuestra” o “la Plataforma”), valoramos tu
          privacidad y nos comprometemos a proteger tus datos personales de acuerdo con la legislación colombiana vigente, en particular la
          Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas que regulan la protección de datos personales.
        </p>

        <h2>1. Responsable del Tratamiento</h2>
        <p>
          <strong>Responsable:</strong> [Nombre completo de la empresa o persona natural]<br />
          <strong>NIT / CC:</strong> [Tu NIT o documento]<br />
          <strong>Domicilio:</strong> Bucaramanga, Santander, Colombia<br />
          <strong>Correo electrónico:</strong> [privacidad@tuapp.com o el que uses]<br />
          <strong>Sitio web:</strong> [www.tuapp.com]
        </p>

        <h2>2. Datos que Recolectamos</h2>
        <p>Recolectamos los siguientes tipos de datos:</p>
        <ul>
          <li>Datos de identificación: nombre, documento de identidad, correo electrónico, número de teléfono.</li>
          <li>
            Datos financieros/transaccionales: información relacionada con movimientos, categorías, etc. (solo lo estrictamente necesario
            para el funcionamiento de la plataforma).
          </li>
          <li>Datos de uso: dirección IP, tipo de dispositivo, navegador, fecha y hora de acceso.</li>
          <li>Datos de geolocalización: aproximada, solo si lo autorizas expresamente.</li>
        </ul>

        <h2>3. Finalidades del Tratamiento</h2>
        <p>Utilizamos tus datos principalmente para:</p>
        <ul>
          <li>Permitir el registro, inicio de sesión y uso de la plataforma.</li>
          <li>Gestionar y mostrar tus movimientos, rankings y dashboard.</li>
          <li>Mejorar la experiencia de usuario y el funcionamiento técnico de la aplicación.</li>
          <li>Cumplir con obligaciones legales y responder a requerimientos de autoridades.</li>
          <li>(Opcional) Enviarte comunicaciones comerciales solo si das consentimiento expreso.</li>
        </ul>

        <h2>4. Derechos que te Asisten (Habeas Data)</h2>
        <p>Como titular de los datos, puedes ejercer gratuitamente los siguientes derechos:</p>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos.</li>
          <li>Solicitar prueba de la autorización otorgada.</li>
          <li>Revocar la autorización o solicitar la supresión de tus datos (salvo cuando exista obligación legal de conservarlos).</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
        </ul>
        <p class="font-medium">Para ejercer cualquiera de estos derechos, escríbenos a: [privacidad@tuapp.com]</p>

        <h2>5. Compartición de Datos</h2>
        <p>No vendemos ni compartimos tus datos personales con terceros con fines comerciales. Solo los compartimos cuando:</p>
        <ul>
          <li>Sea necesario para prestar el servicio (ej. proveedores tecnológicos de hosting, analítica anónima).</li>
          <li>Lo exija una autoridad competente.</li>
        </ul>

        <h2>6. Seguridad de la Información</h2>
        <p>
          Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos contra acceso no autorizado, pérdida, alteración
          o destrucción.
        </p>

        <h2>7. Cambios a esta Política</h2>
        <p>
          Podemos actualizar esta política ocasionalmente. Te notificaremos cambios importantes mediante la plataforma o por correo
          electrónico.
        </p>

        <h2>8. Contacto</h2>
        <p>
          Si tienes dudas sobre esta Política de Privacidad, contáctanos en:<br />
          <strong>Email:</strong> [privacidad@tuapp.com]<br />
          <strong>Dirección:</strong> Bucaramanga, Santander – Colombia
        </p>
      </div>
    </div>
  </drawer>

  <!-- ──────────── Drawer Términos y Condiciones ──────────── -->

  <drawer 
    v-model:visible="showCondiciones" 
    position="full" 
    :modal="true" 
    :showCloseIcon="true" 
    :dismissable="true"
  >

    <div class="w-full max-w-8xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24">
      <!-- Encabezado -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800">Términos y Condiciones</h1>
        <p class="mt-3 text-gray-600 ">Última actualización: 24 de enero de 2026</p>
      </div>

      <!-- Contenido principal -->
      <div class="prose prose-lg prose-gray max-w-none text-justify">
        <p class="sm:pt-2 md:pt-4 lg:pt-6 xl:pt-8">
          Al acceder, descargar, instalar o usar la aplicación <strong>Mony Monty</strong>, ya sea en versión móvil,
          web o cualquier otro medio, aceptas estar vinculado por estos <strong>Términos y Condiciones de Uso</strong>,
          la <strong>Política de Privacidad</strong> y cualquier otra política o norma que publiquemos en la Plataforma.
        </p>

        <p class="py-4 md:py-4">
          Si no estás de acuerdo con estos Términos, <strong> no uses la Plataforma</strong>.
        </p>
       

        <h2>1. Descripción del Servicio</h2>
        <p>
          MonyMonty es una herramienta digital de <strong>gestión de finanzas personales</strong> que permite a los usuarios:<br />

          <ul>
            <li>Primer elemento</li>
            <li>Segundo elemento</li>
            <li>Tercer elemento</li>
          </ul>

          <strong>Responsable:</strong> [Nombre completo de la empresa o persona natural]<br />
          <strong>NIT / CC:</strong> [Tu NIT o documento]<br />
          <strong>Domicilio:</strong> Bucaramanga, Santander, Colombia<br />
          <strong>Correo electrónico:</strong> [privacidad@tuapp.com o el que uses]<br />
          <strong>Sitio web:</strong> [www.tuapp.com]
        </p>

        <h2>2. Datos que Recolectamos</h2>
        <p>Recolectamos los siguientes tipos de datos:</p>
        <ul>
          <li>Datos de identificación: nombre, documento de identidad, correo electrónico, número de teléfono.</li>
          <li>
            Datos financieros/transaccionales: información relacionada con movimientos, categorías, etc. (solo lo estrictamente necesario
            para el funcionamiento de la plataforma).
          </li>
          <li>Datos de uso: dirección IP, tipo de dispositivo, navegador, fecha y hora de acceso.</li>
          <li>Datos de geolocalización: aproximada, solo si lo autorizas expresamente.</li>
        </ul>

        <h2>3. Finalidades del Tratamiento</h2>
        <p>Utilizamos tus datos principalmente para:</p>
        <ul>
          <li>Permitir el registro, inicio de sesión y uso de la plataforma.</li>
          <li>Gestionar y mostrar tus movimientos, rankings y dashboard.</li>
          <li>Mejorar la experiencia de usuario y el funcionamiento técnico de la aplicación.</li>
          <li>Cumplir con obligaciones legales y responder a requerimientos de autoridades.</li>
          <li>(Opcional) Enviarte comunicaciones comerciales solo si das consentimiento expreso.</li>
        </ul>

        <h2>4. Derechos que te Asisten (Habeas Data)</h2>
        <p>Como titular de los datos, puedes ejercer gratuitamente los siguientes derechos:</p>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos.</li>
          <li>Solicitar prueba de la autorización otorgada.</li>
          <li>Revocar la autorización o solicitar la supresión de tus datos (salvo cuando exista obligación legal de conservarlos).</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
        </ul>
        <p class="font-medium">Para ejercer cualquiera de estos derechos, escríbenos a: [privacidad@tuapp.com]</p>

        <h2>5. Compartición de Datos</h2>
        <p>No vendemos ni compartimos tus datos personales con terceros con fines comerciales. Solo los compartimos cuando:</p>
        <ul>
          <li>Sea necesario para prestar el servicio (ej. proveedores tecnológicos de hosting, analítica anónima).</li>
          <li>Lo exija una autoridad competente.</li>
        </ul>

        <h2>6. Seguridad de la Información</h2>
        <p>
          Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos contra acceso no autorizado, pérdida, alteración
          o destrucción.
        </p>

        <h2>7. Cambios a esta Política</h2>
        <p>
          Podemos actualizar esta política ocasionalmente. Te notificaremos cambios importantes mediante la plataforma o por correo
          electrónico.
        </p>

        <h2>8. Contacto</h2>
        <p>
          Si tienes dudas sobre esta Política de Privacidad, contáctanos en:<br />
          <strong>Email:</strong> [privacidad@tuapp.com]<br />
          <strong>Dirección:</strong> Bucaramanga, Santander – Colombia
        </p>
      </div>
    </div>
  </drawer>
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
