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
import {ref, computed, onBeforeUnmount} from "vue";

import {useAuth} from "../logic/useAuth.js";
import {emailSchema, mensajeDe, enmascararCorreo} from "../logic/validaciones.js";
import logo from "../../../assets/img/MonyMontySinFondo3.png";
import FooterAuth from "../components/FooterAuth.vue";
import MmIcon from "@/components/mm/MmIcon.vue";

const {recuperarCuenta, loading} = useAuth();

// "pedir" = formulario (S09) · "enviado" = confirmación (S10)
const vista = ref("pedir");
const email = ref("");
const tocado = ref(false);
const errorServidor = ref("");

const ESPERA_REENVIO_S = 30;
const segundos = ref(0);
let timer = null;

const errorEmail = computed(() => (tocado.value ? mensajeDe(emailSchema, email.value) : ""));
const segundosTxt = computed(() => String(segundos.value).padStart(2, "0"));

function iniciarCuentaAtras() {
  clearInterval(timer);
  segundos.value = ESPERA_REENVIO_S;
  timer = setInterval(() => {
    segundos.value -= 1;
    if (segundos.value <= 0) clearInterval(timer);
  }, 1000);
}

async function enviar() {
  tocado.value = true;
  errorServidor.value = "";
  if (mensajeDe(emailSchema, email.value)) return;

  try {
    const result = await recuperarCuenta({email: email.value.trim()});

    if (result?.success) {
      vista.value = "enviado";
      iniciarCuentaAtras();
    } else {
      errorServidor.value = result?.error || "Error al recuperar la cuenta";
    }
  } catch {
    errorServidor.value = "No pudimos conectar con el servidor. Inténtalo de nuevo.";
  }
}

function usarOtroCorreo() {
  clearInterval(timer);
  vista.value = "pedir";
  tocado.value = false;
}

onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <div class="mm-root" data-theme="light">
    <div class="mm-center" style="position: relative; overflow: hidden">
      <!-- S09 · Pedir el enlace -->
      <template v-if="vista === 'pedir'">
        <div class="mm-float" style="position: absolute; width: 420px; height: 420px; border-radius: 50%; left: -120px; top: -140px; background: var(--brand-tint)"></div>
        <div class="mm-float" style="position: absolute; width: 300px; height: 300px; border-radius: 50%; right: -80px; bottom: -100px; background: var(--balance-tint); animation-delay: -3s"></div>

        <form class="mm-card mm-rise" style="position: relative; width: min(460px, 100%); padding: 36px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; gap: 22px" novalidate @submit.prevent="enviar">
          <img :src="logo" alt="MonyMonty" style="height: 36px; width: auto; align-self: flex-start" />
          <div class="mm-empty" style="padding: 8px 0 0; align-items: flex-start; text-align: left">
            <div class="art" style="width: 88px; height: 88px">
              <div class="mm-ico lg brand mm-float" style="width: 56px; height: 56px; border-radius: 18px"><MmIcon i="key" :s="28" /></div>
            </div>
          </div>
          <div class="col gap-1">
            <h1 class="t-h1">¿Olvidaste tu contraseña?</h1>
            <p class="muted">A todos nos pasa. Escribe tu correo y te enviamos un enlace para crear una nueva.</p>
          </div>

          <div v-if="errorServidor" class="mm-banner expense" role="alert">
            <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ errorServidor }}</span>
          </div>

          <div class="mm-field">
            <label for="rec-email">Correo de tu cuenta</label>
            <div class="mm-input" :class="{'is-error': errorEmail}">
              <MmIcon i="mail" :s="18" />
              <input
                id="rec-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="tu@correo.co"
                :disabled="loading"
                :aria-invalid="Boolean(errorEmail)"
                @blur="tocado = true"
              />
            </div>
            <span v-if="errorEmail" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ errorEmail }}</span>
          </div>

          <button type="submit" class="mm-btn primary lg block" :class="{'is-loading': loading}" :disabled="loading">
            Enviar enlace<MmIcon i="arrow-forward" :s="18" />
          </button>
          <router-link to="/" class="mm-btn ghost block" :class="{'is-disabled': loading}"><MmIcon i="arrow-back" :s="18" />Volver a iniciar sesión</router-link>
        </form>
      </template>

      <!-- S10 · Revisa tu correo -->
      <template v-else>
        <div class="mm-float" style="position: absolute; width: 420px; height: 420px; border-radius: 50%; right: -120px; top: -140px; background: var(--info-tint)"></div>

        <div class="mm-card mm-rise" style="position: relative; width: min(480px, 100%); padding: 40px 36px; box-shadow: var(--shadow-md); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 20px">
          <div style="position: relative; width: 128px; height: 128px; display: grid; place-items: center">
            <div style="position: absolute; inset: 0; border-radius: 50%; background: var(--info-tint); animation: mm-breathe 3.2s var(--ease-in-out) infinite"></div>
            <div class="mm-ico lg info mm-popin" style="position: relative; width: 72px; height: 72px; border-radius: 22px; --i: 2"><MmIcon i="mail" :s="36" /></div>
            <span class="mm-count mm-popin" style="position: absolute; right: 18px; top: 18px; --i: 6; width: 26px; height: 26px; border-radius: 50%">1</span>
          </div>

          <div class="col gap-2">
            <h1 class="t-h1">Revisa tu correo</h1>
            <p class="muted">
              Enviamos un enlace a <b style="color: var(--ink)">{{ enmascararCorreo(email.trim()) }}</b>. Ábrelo desde este dispositivo para crear tu nueva contraseña.
            </p>
          </div>

          <div v-if="errorServidor" class="mm-banner expense" role="alert" style="width: 100%; text-align: left">
            <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ errorServidor }}</span>
          </div>

          <div class="row gap-2" style="width: 100%">
            <a class="mm-btn grow" href="https://mail.google.com" target="_blank" rel="noopener noreferrer"><MmIcon i="logo-google" :s="16" />Abrir Gmail</a>
            <a class="mm-btn grow" href="https://outlook.live.com/mail" target="_blank" rel="noopener noreferrer"><MmIcon i="mail" :s="16" />Abrir Outlook</a>
          </div>

          <div class="mm-card flat" style="width: 100%; background: var(--surface-2); border: 0; padding: 14px 16px; text-align: left">
            <div class="row gap-3">
              <MmIcon i="time" :s="18" />
              <span class="grow t-sm">
                ¿No llegó? Revisa spam
                <template v-if="segundos > 0">o reenvía en <b class="num">0:{{ segundosTxt }}</b></template>
                <template v-else>o pide otro enlace.</template>
              </span>
              <button type="button" class="mm-btn sm" :class="{'is-loading': loading}" :disabled="segundos > 0 || loading" @click="enviar">Reenviar</button>
            </div>
          </div>

          <div class="row gap-4 t-sm">
            <a href="#" @click.prevent="usarOtroCorreo">Usar otro correo</a>
            <router-link to="/">Volver a iniciar sesión</router-link>
          </div>
        </div>
      </template>

      <FooterAuth style="position: absolute; bottom: 16px; left: 0; right: 0; justify-content: center" />
    </div>
  </div>
</template>
