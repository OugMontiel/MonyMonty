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
import {ref, computed, onMounted} from "vue";
import {useRouter} from "vue-router";
import {z} from "zod";

import {useAuth} from "../logic/useAuth.js";
import {emailSchema, mensajeDe} from "../logic/validaciones.js";
import logo from "../../../assets/img/MonyMontySinFondo3.png";
import AuthSplit from "../components/AuthSplit.vue";
import MmIcon from "@/components/mm/MmIcon.vue";

const router = useRouter();
const {login, loading, isAuthenticated} = useAuth();

const email = ref("");
const password = ref("");
const verClave = ref(false);
const tocado = ref({email: false, password: false});
const intentado = ref(false);
// Mensaje que devuelve el servidor (credenciales incorrectas, etc.)
const errorServidor = ref("");

const claveSchema = z.string().min(8, {message: "La contraseña tiene mínimo 8 caracteres"});

// La validación corre mientras se escribe, pero solo se muestra tras tocar el campo o enviar
const errorEmail = computed(() => (tocado.value.email || intentado.value ? mensajeDe(emailSchema, email.value) : ""));
const errorClave = computed(() => (tocado.value.password || intentado.value ? mensajeDe(claveSchema, password.value) : ""));
const hayErrores = computed(() => Boolean(errorEmail.value || errorClave.value));

async function onSubmit() {
  intentado.value = true;
  errorServidor.value = "";

  if (mensajeDe(emailSchema, email.value) || mensajeDe(claveSchema, password.value)) return;

  try {
    const result = await login({email: email.value.trim(), password: password.value});

    if (result?.success) {
      router.push("/tablero");
    } else {
      errorServidor.value = result?.error || "Error en el inicio de sesión";
    }
  } catch {
    errorServidor.value = "No pudimos conectar con el servidor. Inténtalo de nuevo.";
  }
}

// Si ya hay sesión, no tiene sentido ver el login
onMounted(() => {
  if (isAuthenticated.value) router.push("/tablero");
});
</script>

<template>
  <AuthSplit :info-start="0">
    <template #cabecera>
      <img :src="logo" alt="MonyMonty" style="height: 44px; width: auto; align-self: flex-start" />
    </template>

    <div class="col gap-1">
      <h1 class="t-h1" style="font-size: 32px; line-height: 38px">Hola de nuevo</h1>
      <p class="muted">Ingresa para ver cómo van tus finanzas hoy.</p>
    </div>

    <div v-if="errorServidor" class="mm-banner expense" role="alert">
      <MmIcon i="alert-circle" :s="18" />
      <span class="grow">{{ errorServidor }}</span>
    </div>

    <form class="col gap-6" novalidate @submit.prevent="onSubmit">
      <div class="col gap-4">
        <div class="mm-field">
          <label for="login-email">Correo electrónico</label>
          <div class="mm-input" :class="{'is-error': errorEmail}">
            <MmIcon i="mail" :s="18" />
            <input
              id="login-email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="tu@correo.co"
              :disabled="loading"
              :aria-invalid="Boolean(errorEmail)"
              @blur="tocado.email = true"
            />
          </div>
          <span v-if="errorEmail" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ errorEmail }}</span>
        </div>

        <div class="mm-field">
          <div class="row between">
            <label class="mm-flabel" for="login-password">Contraseña</label>
            <router-link to="/recuperarCuenta" class="t-sm">¿La olvidaste?</router-link>
          </div>
          <div class="mm-input" :class="{'is-error': errorClave}">
            <MmIcon i="lock-closed" :s="18" />
            <input
              id="login-password"
              v-model="password"
              :type="verClave ? 'text' : 'password'"
              autocomplete="current-password"
              :disabled="loading"
              :aria-invalid="Boolean(errorClave)"
              @blur="tocado.password = true"
            />
            <button
              type="button"
              class="mm-btn icon sm ghost"
              :aria-label="verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              style="margin-right: -8px"
              @click="verClave = !verClave"
            >
              <MmIcon :i="verClave ? 'eye-off' : 'eye'" :s="18" />
            </button>
          </div>
          <span v-if="errorClave" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ errorClave }}</span>
        </div>
      </div>

      <button type="submit" class="mm-btn primary lg block" :class="{'is-loading': loading}" :disabled="loading || hayErrores">
        Iniciar sesión<MmIcon i="arrow-forward" :s="18" />
      </button>
    </form>

    <router-link to="/crearCuenta" class="mm-btn lg block" :class="{'is-disabled': loading}">
      <MmIcon i="person-add" :s="18" />Crear cuenta gratis
    </router-link>
  </AuthSplit>
</template>
