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
import {useRouter} from "vue-router";
import {useToast} from "primevue/usetoast";
import {Icon} from "@iconify/vue";
import {DateTime} from "luxon";

import {useAuth} from "../logic/useAuth.js";
import {useLoadingStore} from "../../../stores/contexto/loadingStore";
import {
  nombreSchema,
  apellidoSchema,
  fechaNacimientoSchema,
  generoSchema,
  emailSchema,
  claveNuevaSchema,
  confirmarClaveSchema,
  aceptaLegalSchema,
  mensajeDe,
  fechaMaximaNacimiento,
  REQUISITOS_CLAVE,
} from "../logic/validaciones.js";
import {CAMPOS_PASO, GENEROS, NIVELES_CLAVE, PASOS_REGISTRO} from "../logic/registroConstants.js";
import logo from "../../../assets/img/MonyMontySinFondo3.png";
import AuthSplit from "../components/AuthSplit.vue";
import PasosRegistro from "../components/PasosRegistro.vue";
import PasoPlan from "../components/PasoPlan.vue";
import MensajeError from "../components/MensajeError.vue";
import TerminosCondicionesDrawer from "../components/modales/terminosCondiciones.vue";
import PoliticaPrivacidadDrawer from "../components/modales/politicaPrivacidad.vue";

const toast = useToast();
const router = useRouter();
const {CrearUsuario} = useAuth();
const loadingStore = useLoadingStore();
const loading = computed(() => loadingStore.auth);

const paso = ref(1);
const form = reactive({
  nombre: "",
  apellido: "",
  fechaNacimiento: "",
  genero: "",
  email: "",
  clave: "",
  confirmar: "",
  acepta: false,
  plan: "free",
});

const verClave = ref(false);
const verConfirmar = ref(false);
const showCondiciones = ref(false);
const showPrivacidad = ref(false);

// Un error se muestra al salir del campo o al intentar avanzar, no mientras se escribe por primera vez
const tocado = reactive({});
const intentado = ref(false);
const fechaMaxima = fechaMaximaNacimiento();

const reglas = {
  nombre: nombreSchema,
  apellido: apellidoSchema,
  fechaNacimiento: fechaNacimientoSchema,
  genero: generoSchema,
  email: emailSchema,
  clave: claveNuevaSchema,
  acepta: aceptaLegalSchema,
};

function mensaje(campo) {
  if (campo === "confirmar") return mensajeDe(confirmarClaveSchema(form.clave), form.confirmar);
  return mensajeDe(reglas[campo], form[campo]);
}

const error = (campo) => (tocado[campo] || intentado.value ? mensaje(campo) : "");
const marcar = (campo) => {
  tocado[campo] = true;
};

const nombrePila = computed(() => form.nombre.trim().split(/\s+/)[0]);
const tituloAcceso = computed(() => (nombrePila.value ? `Crea tu acceso, ${nombrePila.value}` : "Crea tu acceso"));

const emailValido = computed(() => form.email !== "" && !mensajeDe(emailSchema, form.email));
const clavesCoinciden = computed(() => form.confirmar !== "" && form.confirmar === form.clave);

// Fuerza de la clave: cuántos requisitos cumple y cuál es el siguiente por resolver
const requisitos = computed(() => REQUISITOS_CLAVE.map((r) => ({...r, ok: r.cumple(form.clave)})));
const cumplidos = computed(() => requisitos.value.filter((r) => r.ok).length);
const nivelClave = computed(() => NIVELES_CLAVE[cumplidos.value]);
const pistaClave = computed(() => requisitos.value.find((r) => !r.ok)?.pista ?? "Lista para proteger tu cuenta");

function continuar() {
  intentado.value = true;
  if (CAMPOS_PASO[paso.value].some((campo) => mensaje(campo))) return;

  intentado.value = false;
  paso.value += 1;
  window.scrollTo({top: 0});
}

function volver() {
  intentado.value = false;
  paso.value -= 1;
  window.scrollTo({top: 0});
}

async function crearCuenta() {
  try {
    const result = await CrearUsuario({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      fechaNacimiento: DateTime.fromISO(form.fechaNacimiento).toJSDate(),
      genero: form.genero,
      email: form.email.trim(),
      password: form.clave,
      planId: form.plan,
      acceptLegal: form.acepta,
    });

    if (result?.success) {
      toast.add({severity: "success", summary: "Éxito", detail: result.message || "Se ha creado el Usuario.", life: 4500});
      void router.push("/");
    } else {
      toast.add({severity: "error", summary: "Error", detail: result?.error || "Error en Crear Cuenta", life: 4500});
    }
  } catch {
    toast.add({severity: "error", summary: "Error de conexión", detail: "Inténtalo de nuevo.", life: 4000});
  }
}
</script>

<template>
  <PasoPlan v-if="paso === PASOS_REGISTRO.length" v-model:plan="form.plan" :cargando="loading" @atras="volver" @crear="crearCuenta" />

  <AuthSplit v-else :info-start="paso + 1" :ancho="440">
    <template #cabecera>
      <div class="row between">
        <img :src="logo" alt="MonyMonty" style="height: 40px; width: auto" />
        <router-link to="/" class="t-sm">Ya tengo cuenta</router-link>
      </div>
    </template>

    <PasosRegistro :paso="paso" />

    <!-- Paso 1 · Tus datos -->
    <template v-if="paso === 1">
      <div class="col gap-1">
        <h1 class="t-h1">Cuéntanos de ti</h1>
        <p class="muted">Con esto personalizamos consejos y lecciones. No vendemos tus datos.</p>
      </div>

      <form class="col gap-6" novalidate @submit.prevent="continuar">
        <div class="grid g2" style="gap: 16px">
          <div class="field">
            <label for="registro-nombre">Nombre</label>
            <div class="input" :class="{'is-error': error('nombre')}">
              <input
                id="registro-nombre"
                v-model="form.nombre"
                type="text"
                autocomplete="given-name"
                placeholder="Tu nombre"
                :aria-invalid="Boolean(error('nombre'))"
                @blur="marcar('nombre')"
              />
            </div>
            <MensajeError :texto="error('nombre')" />
          </div>

          <div class="field">
            <label for="registro-apellido">Apellido</label>
            <div class="input" :class="{'is-error': error('apellido')}">
              <input
                id="registro-apellido"
                v-model="form.apellido"
                type="text"
                autocomplete="family-name"
                placeholder="Tu apellido"
                :aria-invalid="Boolean(error('apellido'))"
                @blur="marcar('apellido')"
              />
            </div>
            <MensajeError :texto="error('apellido')" />
          </div>
        </div>

        <div class="field">
          <label for="registro-fecha">Fecha de nacimiento</label>
          <div class="input" :class="{'is-error': error('fechaNacimiento')}">
            <Icon icon="ion:calendar-outline" :width="18" :height="18" />
            <input
              id="registro-fecha"
              v-model="form.fechaNacimiento"
              type="date"
              autocomplete="bday"
              :max="fechaMaxima"
              :aria-invalid="Boolean(error('fechaNacimiento'))"
              @blur="marcar('fechaNacimiento')"
            />
          </div>
          <MensajeError :texto="error('fechaNacimiento')" />
          <span v-if="!error('fechaNacimiento')" class="help">Debes ser mayor de edad para usar MonyMonty.</span>
        </div>

        <div class="field" role="radiogroup" aria-labelledby="registro-genero">
          <span id="registro-genero" class="flabel">Género</span>
          <div class="row" style="flex-wrap: wrap; gap: 8px">
            <label v-for="g in GENEROS" :key="g" class="chip" :class="{'is-on': form.genero === g}">
              <input
                v-model="form.genero"
                type="radio"
                name="registro-genero"
                :value="g"
                :aria-invalid="Boolean(error('genero'))"
                @blur="marcar('genero')"
              />
              {{ g }}
            </label>
          </div>
          <MensajeError :texto="error('genero')" />
        </div>

        <div class="row gap-3">
          <router-link to="/" class="btn lg ghost"><Icon icon="ion:arrow-back-outline" :width="18" :height="18" />Volver</router-link>
          <button type="submit" class="btn primary lg grow">
            Continuar<Icon icon="ion:arrow-forward-outline" :width="18" :height="18" />
          </button>
        </div>
      </form>
    </template>

    <!-- Paso 2 · Acceso -->
    <template v-else>
      <div class="col gap-1">
        <h1 class="t-h1">{{ tituloAcceso }}</h1>
        <p class="muted">Usarás este correo para entrar y recuperar tu cuenta.</p>
      </div>

      <form class="col" style="gap: 20px" novalidate @submit.prevent="continuar">
        <div class="field">
          <label for="registro-email">Correo electrónico</label>
          <div class="input" :class="{'is-error': error('email')}">
            <Icon icon="ion:mail-outline" :width="18" :height="18" />
            <input
              id="registro-email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="tu@correo.co"
              :aria-invalid="Boolean(error('email'))"
              @blur="marcar('email')"
            />
            <span v-if="emailValido" class="income"><Icon icon="ion:checkmark-circle-outline" :width="18" :height="18" /></span>
          </div>
          <MensajeError :texto="error('email')" />
        </div>

        <div class="field">
          <label for="registro-clave">Contraseña</label>
          <div class="input" :class="{'is-error': error('clave')}">
            <Icon icon="ion:lock-closed-outline" :width="18" :height="18" />
            <input
              id="registro-clave"
              v-model="form.clave"
              :type="verClave ? 'text' : 'password'"
              autocomplete="new-password"
              :aria-invalid="Boolean(error('clave'))"
              @blur="marcar('clave')"
            />
            <button
              type="button"
              class="btn icon sm ghost"
              :aria-label="verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              :aria-pressed="verClave"
              style="margin-right: -8px"
              @click="verClave = !verClave"
            >
              <Icon :icon="verClave ? 'ion:eye-off-outline' : 'ion:eye-outline'" :width="18" :height="18" />
            </button>
          </div>
          <MensajeError :texto="error('clave')" />

          <div v-if="form.clave" class="col gap-1" style="margin-top: 4px">
            <div class="strength" aria-hidden="true">
              <i v-for="n in 4" :key="n" :class="{on: n <= cumplidos}" :style="{animationDelay: `${(n - 1) * 0.08}s`}"></i>
            </div>
            <div class="row between t-xs">
              <b :class="nivelClave.tono">{{ nivelClave.texto }}</b>
              <span class="muted">{{ pistaClave }}</span>
            </div>
          </div>
          <div class="grid g2" style="gap: 6px 16px; margin-top: 4px">
            <span v-for="r in requisitos" :key="r.id" class="row gap-1 t-xs" :class="r.ok ? 'income' : 'muted'">
              <Icon :icon="r.ok ? 'ion:checkmark-circle-outline' : 'ion:add-circle-outline'" :width="14" :height="14" />{{ r.texto }}
            </span>
          </div>
        </div>

        <div class="field">
          <label for="registro-confirmar">Confirma la contraseña</label>
          <div class="input" :class="{'is-error': error('confirmar')}">
            <Icon icon="ion:lock-closed-outline" :width="18" :height="18" />
            <input
              id="registro-confirmar"
              v-model="form.confirmar"
              :type="verConfirmar ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Repite tu contraseña"
              :aria-invalid="Boolean(error('confirmar'))"
              @blur="marcar('confirmar')"
            />
            <span v-if="clavesCoinciden" class="income"><Icon icon="ion:checkmark-circle-outline" :width="18" :height="18" /></span>
            <button
              type="button"
              class="btn icon sm ghost"
              :aria-label="verConfirmar ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              :aria-pressed="verConfirmar"
              style="margin-right: -8px"
              @click="verConfirmar = !verConfirmar"
            >
              <Icon :icon="verConfirmar ? 'ion:eye-off-outline' : 'ion:eye-outline'" :width="18" :height="18" />
            </button>
          </div>
          <MensajeError :texto="error('confirmar')" />
          <span v-if="clavesCoinciden" class="row gap-1 t-xs income">
            <Icon icon="ion:checkmark-outline" :width="12" :height="12" />Las contraseñas coinciden
          </span>
        </div>

        <div class="col gap-1">
          <label class="row t-sm acepta">
            <input v-model="form.acepta" type="checkbox" class="oculto" @blur="marcar('acepta')" />
            <span class="check" :class="{'is-on': form.acepta}">
              <Icon v-if="form.acepta" icon="ion:checkmark-outline" :width="14" :height="14" />
            </span>
            <span>
              Acepto los
              <button type="button" class="enlace" @click="showCondiciones = true">Términos y condiciones</button>
              y la
              <button type="button" class="enlace" @click="showPrivacidad = true">Política de privacidad</button>.
            </span>
          </label>
          <MensajeError :texto="error('acepta')" />
        </div>

        <div class="row gap-3">
          <button type="button" class="btn lg ghost" @click="volver">
            <Icon icon="ion:arrow-back-outline" :width="18" :height="18" />Atrás
          </button>
          <button type="submit" class="btn primary lg grow">
            Continuar<Icon icon="ion:arrow-forward-outline" :width="18" :height="18" />
          </button>
        </div>
      </form>

      <TerminosCondicionesDrawer v-model:visible="showCondiciones" />
      <PoliticaPrivacidadDrawer v-model:visible="showPrivacidad" />
    </template>
  </AuthSplit>
</template>

<style scoped>
/* Casilla real oculta a la vista pero accesible por teclado; la caja .check es solo visual */
.oculto {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.acepta {
  align-items: flex-start;
  cursor: pointer;
}

.acepta .check {
  margin-top: 1px;
}

.oculto:focus-visible + .check {
  outline: 2px solid var(--brand-strong);
  outline-offset: 2px;
}

.enlace {
  padding: 0;
  border: 0;
  background: none;
  color: var(--brand-ink);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
