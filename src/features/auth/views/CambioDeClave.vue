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
import {ref, computed, onMounted, onBeforeUnmount} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {z} from "zod";

import {useAuth} from "../logic/useAuth.js";
import {passwordSchema, validar, fortalezaClave} from "../logic/validaciones.js";
import logo from "../../../assets/img/MonyMontySinFondo3.png";
import FooterAuth from "../components/FooterAuth.vue";
import MmIcon from "@/components/mm/MmIcon.vue";

const toast = useToast();
const router = useRouter();
const {verificacionTocken, CambiodeClave, loading} = useAuth();

// "verificando" -> "formulario" (S11) | "vencido" (S11 alterno) -> "listo" (S12)
const vista = ref("verificando");
const user = ref({});
const token = ref("");

const password = ref("");
const confirmPassword = ref("");
const verClave = ref(false);
const intentado = ref(false);
const errorServidor = ref("");

const SEGUNDOS_REDIRECCION = 5;
const segundos = ref(SEGUNDOS_REDIRECCION);
let timer = null;

onMounted(async () => {
  const params = new URLSearchParams(window?.location?.search);
  token.value = params.get("token") ?? "";

  if (!token.value) {
    vista.value = "vencido";
    return;
  }

  try {
    const result = await verificacionTocken({token: token.value});

    if (result?.success) {
      user.value = result?.data?.userDelTocken ?? {};
      vista.value = "formulario";
    } else {
      vista.value = "vencido";
    }
  } catch {
    vista.value = "vencido";
  }
});

const esquema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, {message: "Confirma tu contraseña"}),
  })
  .refine((d) => d.password === d.confirmPassword, {message: "Las contraseñas no coinciden", path: ["confirmPassword"]});

const errores = computed(() => validar(esquema, {password: password.value, confirmPassword: confirmPassword.value}).errores);
const verError = (campo) => (intentado.value ? errores.value[campo] : "");

const fuerza = computed(() => fortalezaClave(password.value));
const colorFuerza = computed(() => `var(--${fuerza.value.tono})`);
const coinciden = computed(() => confirmPassword.value.length > 0 && password.value === confirmPassword.value);

async function guardar() {
  intentado.value = true;
  errorServidor.value = "";
  if (Object.keys(errores.value).length) return;

  try {
    const result = await CambiodeClave({
      token: token.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });

    if (result?.success) {
      vista.value = "listo";
      cuentaAtrasHaciaLogin();
    } else {
      errorServidor.value = result?.error || "Error al cambiar la contraseña";
    }
  } catch {
    toast.add({severity: "error", summary: "Error de conexión", detail: "Inténtalo de nuevo.", life: 4000});
  }
}

function cuentaAtrasHaciaLogin() {
  timer = setInterval(() => {
    segundos.value -= 1;
    if (segundos.value <= 0) irALogin();
  }, 1000);
}

function irALogin() {
  clearInterval(timer);
  router.push("/");
}

onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <div class="mm-root" data-theme="light">
    <div class="mm-center" style="position: relative; overflow: hidden">
      <!-- Comprobando el enlace -->
      <div v-if="vista === 'verificando'" class="col gap-3" style="align-items: center" role="status">
        <div class="mm-spin" style="width: 32px; height: 32px"></div>
        <span class="muted t-sm">Verificando tu enlace…</span>
      </div>

      <!-- S11 · Nueva contraseña -->
      <template v-else-if="vista === 'formulario'">
        <div class="mm-float" style="position: absolute; width: 420px; height: 420px; border-radius: 50%; left: -120px; bottom: -160px; background: var(--brand-tint)"></div>

        <form class="mm-card mm-rise" style="position: relative; width: min(460px, 100%); padding: 36px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; gap: 20px" novalidate @submit.prevent="guardar">
          <img :src="logo" alt="MonyMonty" style="height: 36px; width: auto; align-self: flex-start" />
          <div class="col gap-1">
            <h1 class="t-h1">Crea tu nueva contraseña</h1>
            <p class="muted">
              Para <b style="color: var(--ink)">{{ user?.email }}</b>
              <template v-if="user?.nombre"> ({{ user.nombre }})</template>.
            </p>
          </div>

          <div v-if="errorServidor" class="mm-banner expense" role="alert">
            <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ errorServidor }}</span>
          </div>

          <div class="mm-field">
            <label for="cc-password">Nueva contraseña</label>
            <div class="mm-input" :class="{'is-error': verError('password')}">
              <MmIcon i="lock-closed" :s="18" />
              <input id="cc-password" v-model="password" :type="verClave ? 'text' : 'password'" autocomplete="new-password" :disabled="loading" :aria-invalid="Boolean(verError('password'))" />
              <button type="button" class="mm-btn icon sm ghost" :aria-label="verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'" style="margin-right: -8px" @click="verClave = !verClave">
                <MmIcon :i="verClave ? 'eye-off' : 'eye'" :s="18" />
              </button>
            </div>
            <div class="mm-strength" style="margin-top: 4px" aria-hidden="true">
              <i v-for="n in 4" :key="n" :class="{on: n <= fuerza.nivel}" :style="n <= fuerza.nivel ? {background: colorFuerza} : null"></i>
            </div>
            <div class="row between t-xs">
              <b :style="{color: password ? colorFuerza : 'var(--ink-muted)'}">{{ password ? fuerza.etiqueta : "Escribe una contraseña" }}</b>
              <span class="muted">{{ password.length }} caracteres</span>
            </div>
            <div class="grid g2" style="gap: 6px 16px; margin-top: 4px">
              <span v-for="r in fuerza.reglas" :key="r.texto" class="row gap-1 t-xs" :class="r.ok ? 'income' : 'muted'">
                <MmIcon :i="r.ok ? 'checkmark-circle' : 'add-circle'" :s="14" />{{ r.texto }}
              </span>
            </div>
            <span v-if="verError('password')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("password") }}</span>
          </div>

          <div class="mm-field">
            <label for="cc-confirm">Confírmala</label>
            <div class="mm-input" :class="{'is-error': verError('confirmPassword')}">
              <MmIcon i="lock-closed" :s="18" />
              <input id="cc-confirm" v-model="confirmPassword" :type="verClave ? 'text' : 'password'" autocomplete="new-password" :disabled="loading" :aria-invalid="Boolean(verError('confirmPassword'))" />
              <span v-if="coinciden" class="income"><MmIcon i="checkmark-circle" :s="18" /></span>
            </div>
            <span v-if="verError('confirmPassword')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError("confirmPassword") }}</span>
            <span v-else-if="coinciden" class="mm-help income">Coinciden</span>
          </div>

          <button type="submit" class="mm-btn primary lg block" :class="{'is-loading': loading}" :disabled="loading">Guardar contraseña</button>
          <router-link to="/" class="mm-btn ghost block" :class="{'is-disabled': loading}">Volver al inicio</router-link>
        </form>
      </template>

      <!-- S11 alterno · enlace inválido o vencido -->
      <template v-else-if="vista === 'vencido'">
        <div class="mm-float" style="position: absolute; width: 420px; height: 420px; border-radius: 50%; left: -120px; bottom: -160px; background: var(--brand-tint)"></div>
        <div class="mm-card mm-rise" style="position: relative; width: min(420px, 100%); padding: 28px; display: flex; flex-direction: column; gap: 14px; align-items: flex-start; box-shadow: var(--shadow-md)">
          <div class="mm-ico warn"><MmIcon i="hourglass" :s="22" /></div>
          <h1 class="t-h2">Este enlace no es válido o ya venció</h1>
          <p class="t-sm muted">Por seguridad, los enlaces de recuperación caducan. Pide uno nuevo y llegará en segundos.</p>
          <router-link to="/recuperarCuenta" class="mm-btn soft block"><MmIcon i="refresh" :s="16" />Pedir otro enlace</router-link>
          <router-link to="/" class="mm-btn ghost block">Volver al inicio</router-link>
        </div>
      </template>

      <!-- S12 · Contraseña actualizada -->
      <template v-else>
        <div class="mm-float" style="position: absolute; width: 480px; height: 480px; border-radius: 50%; left: 50%; top: 50%; margin: -340px 0 0 -240px; background: var(--income-tint); opacity: 0.7"></div>
        <div class="mm-card mm-rise" style="position: relative; width: min(440px, 100%); padding: 44px 36px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 18px">
          <svg class="mm-success-check" width="112" height="112" viewBox="0 0 112 112" aria-hidden="true"><circle cx="56" cy="56" r="56"></circle><path d="M36 58l14 14 26-30"></path></svg>
          <div class="col gap-2">
            <h1 class="t-h1">¡Listo! Tu contraseña cambió</h1>
            <p class="muted">Ya puedes entrar con tu nueva clave.</p>
          </div>
          <button type="button" class="mm-btn primary lg block" @click="irALogin">Iniciar sesión<MmIcon i="arrow-forward" :s="18" /></button>
          <div class="col gap-2" style="width: 100%">
            <div class="mm-progress sm"><i :style="{'--w': '100%', '--c': 'var(--income)', animationDuration: `${SEGUNDOS_REDIRECCION}s`, animationTimingFunction: 'linear'}"></i></div>
            <span class="t-xs muted" role="status">Te llevamos al inicio de sesión en {{ segundos }} s</span>
          </div>
        </div>
      </template>

      <FooterAuth style="position: absolute; bottom: 16px; left: 0; right: 0; justify-content: center" />
    </div>
  </div>
</template>
