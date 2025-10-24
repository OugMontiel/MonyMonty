<script>
import logo from "@/assets/img/MonyMontySinFondo3.png";
import {Icon} from "@iconify/vue";
import {reactive, computed} from "vue";
import {object, string, date, ref} from "yup";

// Función para calcular fecha mínima (mayor de 18 años)
const MIN_EDAD = 18;
const fechaMinima = new Date();
fechaMinima.setFullYear(fechaMinima.getFullYear() - MIN_EDAD);

// Regex de reutilización
const REGEX_MAYUS = /[A-Z]/;
const REGEX_NUMERO = /\d/;
const REGEX_SIMBOLO = /[!@#$%^&*()_\-+=<>?{}[\]~]/;

export const schemaRegistro = object({
  nombre: string().trim().required("El nombre es obligatorio").min(2, "Debe tener al menos 2 caracteres"),
  apellido: string().trim().required("El apellido es obligatorio").min(2, "Debe tener al menos 2 caracteres"),
  fechaNacimiento: date().required("La fecha es obligatoria").max(fechaMinima, "Debes ser mayor de 18 años"),
  genero: string().required("Selecciona un género").oneOf(["Mujer", "Hombre"], "Opción no válida"),
  email: string().trim().required("El email es obligatorio").email("Formato de email inválido"),
  password: string()
    .required("La contraseña es obligatoria")
    .min(8, "Debe tener al menos 8 caracteres")
    .matches(REGEX_MAYUS, "Debe contener al menos una mayúscula")
    .matches(REGEX_NUMERO, "Debe contener al menos un número")
    .matches(REGEX_SIMBOLO, "Debe contener al menos un símbolo"),
  confirmPassword: string()
    .oneOf([ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});

export default {
  name: "RegisterForm",
  setup() {
    const form = reactive({
      nombre: "",
      apellido: "",
      fechaNacimiento: new Date().toISOString().split("T")[0],
      genero: "Mujer",
      email: "",
      contraseña: "",
    });

    const errors = reactive({});

    const generos = [
      {label: "Mujer", value: "Mujer", icon: "pi pi-venus"},
      {label: "Hombre", value: "Hombre", icon: "pi pi-mars"},
    ];

    const isMujerSelected = computed(() => form.genero === "Mujer");

    const selectGenero = (genero) => {
      form.genero = genero;
    };

    return {logo, form, isMujerSelected, selectGenero, errors, generos};
  },
  methods: {
    async handleSubmit() {
      try {
        await schema.validate(this.form, {abortEarly: false});

        // Registro exitoso
        console.log("Datos válidos:", this.form);
        // TODO: Llamar API de registro
      } catch (err) {
        if (err.inner) {
          err.inner.forEach((error) => {
            this.errors[error.path] = error.message;
          });
        }
        alert(err.errors?.[0] || "Por favor completa todos los campos correctamente");
      }
    },

    irALogin() {
      this.$router.push("/");
    },

    irAPrivacidad() {
      this.$router.push("/privacidad");
    },

    irACondiciones() {
      this.$router.push("/condiciones");
    },
  },
  components: {
    Icon,
  },
};
</script>

<template>
  <div class="form-container">
    <div class="card">
      <div class="logo-section">
        <img :src="logo" alt="Icono de la aplicación" class="logo-icon" />
      </div>
      <div class="user-section">
        <FloatLabel variant="on">
          <InputText id="nombre" v-model.trim="form.nombre" />
          <label for="nombre">Nombre</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText id="apellido" v-model.trim="form.apellido" />
          <label for="apellido">Apellido</label>
        </FloatLabel>
      </div>

      <div class="nacimiento-section">
        <FloatLabel variant="on">
          <DatePicker id="fechaNacimiento" v-model="form.fechaNacimiento" :max-date="new Date()" date-format="yy-mm-dd" show-icon />
          <label for="fechaNacimiento">Fecha de nacimiento</label>
        </FloatLabel>
      </div>

      <div class="genero-section">
        <label>Género</label>
        <SelectButton v-model="form.genero" :options="generos" optionLabel="label" optionValue="value" allowEmpty="false">
          <template #option="slotProps">
            <i :class="slotProps.option.icon" class="mr-2"></i>
            {{ slotProps.option.label }}
          </template>
        </SelectButton>
      </div>

      <div class="correo-container">
        <FloatLabel variant="on">
          <InputText id="email" type="email" v-model.trim="form.email" />
          <label for="email">Correo electrónico</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText id="password" type="password" v-model="form.contraseña" />
          <label for="password">Contraseña</label>
        </FloatLabel>
      </div>

      <p class="text-small">
        Al hacer clic en "Registrarte", aceptas nuestras
        <span class="text-condicionesypoliticas" @click="irACondiciones"> Condiciones </span>, y
        <span class="text-condicionesypoliticas" @click="irAPrivacidad"> Política de privacidad </span>.
      </p>

      <button type="submit" @click="handleSubmit" class="register-button">Registrarte</button>

      <p @click="irALogin" class="forgot-login">¿Ya tienes una cuenta?</p>
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
  margin-bottom: 10px;
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
  color: #1877f2;
  font-size: 10px;
  cursor: pointer;
  text-align: center;
  text-decoration: underline;
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
