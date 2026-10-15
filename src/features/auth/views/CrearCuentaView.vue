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
import {z} from "zod";

import {useAuth} from "../logic/useAuth.js";
import {useOnboarding} from "@/features/onboarding/logic/useOnboarding.js";
import {
  emailSchema,
  passwordSchema,
  nombreSchema,
  validar,
  fortalezaClave,
  parseFecha,
  mascaraFecha,
  fechaMinimaMayorDeEdad,
} from "../logic/validaciones.js";
import logo from "../../../assets/img/MonyMontySinFondo3.png";
import AuthSplit from "../components/AuthSplit.vue";
import FooterAuth from "../components/FooterAuth.vue";
import MmIcon from "@/components/mm/MmIcon.vue";
import TerminosCondicionesDrawer from "../components/modales/terminosCondiciones.vue";
import PoliticaPrivacidadDrawer from "../components/modales/politicaPrivacidad.vue";

const toast = useToast();
const router = useRouter();
const {CrearUsuario, login, loading} = useAuth();
const onboarding = useOnboarding();

const TOTAL_PASOS = 3;
const paso = ref(1);

// Valores que acepta la API hoy (la validación anterior solo permitía estos dos)
const GENEROS = ["Femenino", "Masculino"];
const PLANES = [
  {
    id: "Free",
    icono: "wallet",
    tono: "",
    precio: "$ 0",
    resumen: "Para ordenar lo básico y crear el hábito.",
    items: ["Movimientos ilimitados", "Hasta 3 cuentas", "Tablero y categorías", "Lecciones nivel 1"],
  },
  {
    id: "Basic",
    icono: "rocket",
    tono: "brand",
    recomendado: true,
    resumen: "Para planear el mes y salir de deudas.",
    items: ["Todo lo de Free", "Cuentas ilimitadas", "Presupuesto y deudas", "Importar extractos CSV", "3 metas de ahorro"],
  },
  {
    id: "Premium",
    icono: "sparkles",
    tono: "balance",
    resumen: "Para crecer con acompañamiento experto.",
    items: ["Todo lo de Basic", "Metas ilimitadas", "Reportes en PDF", "Asesoría con mentores", "Todas las lecciones"],
  },
];

const form = reactive({
  nombre: "",
  apellido: "",
  fechaTexto: "",
  genero: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptLegal: false,
  plan: "Free",
});

const verClave = ref(false);
const intentado = reactive({1: false, 2: false});
const errorServidor = ref("");
const showCondiciones = ref(false);
const showPrivacidad = ref(false);

// ---------- Validación por paso ----------
const esquemaPaso1 = z.object({
  nombre: nombreSchema("nombre"),
  apellido: nombreSchema("apellido"),
  fecha: z.date({message: "Escribe tu fecha con el formato DD/MM/AAAA"}).refine((f) => f <= fechaMinimaMayorDeEdad(), {message: "Debes ser mayor de 18 años"}),
  genero: z.string().min(1, {message: "Debes seleccionar un género"}).refine((g) => GENEROS.includes(g), {message: "Opción no válida"}),
});

const esquemaPaso2 = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, {message: "Confirma tu contraseña"}),
    acceptLegal: z.literal(true, {message: "Debes aceptar los términos y la política de privacidad para continuar"}),
  })
  .refine((d) => d.password === d.confirmPassword, {message: "Las contraseñas no coinciden", path: ["confirmPassword"]});

const erroresPaso1 = computed(() => validar(esquemaPaso1, {...form, fecha: parseFecha(form.fechaTexto)}).errores);
const erroresPaso2 = computed(() => validar(esquemaPaso2, form).errores);

// Los errores solo aparecen cuando la persona ya intentó avanzar, para no gritar desde la primera letra
const verError1 = (campo) => (intentado[1] ? erroresPaso1.value[campo] : "");
const verError2 = (campo) => (intentado[2] ? erroresPaso2.value[campo] : "");

const fuerza = computed(() => fortalezaClave(form.password));
const coinciden = computed(() => form.confirmPassword.length > 0 && form.password === form.confirmPassword);
const colorFuerza = computed(() => `var(--${fuerza.value.tono})`);

// ---------- Calendario para elegir la fecha de nacimiento ----------
const selectorFecha = ref(null);
const dos = (n) => String(n).padStart(2, "0");
const aISO = (f) => `${f.getFullYear()}-${dos(f.getMonth() + 1)}-${dos(f.getDate())}`;
// Solo mayores de edad: el calendario no permite fechas posteriores a hace 18 años
const fechaMaximaISO = aISO(fechaMinimaMayorDeEdad());
const fechaEnISO = computed(() => {
  const f = parseFecha(form.fechaTexto);
  return f ? aISO(f) : "";
});

function abrirCalendario() {
  const el = selectorFecha.value;
  if (!el) return;
  // Si todavía no hay fecha, el calendario abre en el límite de los 18 años en vez de en hoy
  if (!el.value) el.value = fechaMaximaISO;
  try {
    el.showPicker();
  } catch {
    // Navegadores sin showPicker (o sin gesto del usuario): el campo de texto sigue funcionando
    el.focus();
  }
}

function alElegirEnCalendario(e) {
  const [a, m, d] = e.target.value.split("-");
  if (a) form.fechaTexto = `${d}/${m}/${a}`;
}

function alEscribirFecha(e) {
  form.fechaTexto = mascaraFecha(e.target.value);
  e.target.value = form.fechaTexto;
}

function siguiente() {
  errorServidor.value = "";
  const pasoActual = paso.value;
  intentado[pasoActual] = true;

  const errores = pasoActual === 1 ? erroresPaso1.value : erroresPaso2.value;
  if (Object.keys(errores).length) return;

  paso.value = pasoActual + 1;
}

function atras() {
  errorServidor.value = "";
  paso.value -= 1;
}

// ---------- Envío (POST user, igual que antes) ----------
async function crearCuenta() {
  errorServidor.value = "";

  try {
    const result = await CrearUsuario({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      fechaNacimiento: parseFecha(form.fechaTexto),
      genero: form.genero,
      email: form.email.trim(),
      password: form.password,
      planId: form.plan.toLowerCase(),
      acceptLegal: form.acceptLegal,
    });

    if (!result?.success) {
      errorServidor.value = result?.error || "Error en Crear Cuenta";
      return;
    }

    // La API no deja la sesión abierta al registrar: se inicia con las mismas credenciales
    // para que la configuración inicial pueda crear la cuenta y las categorías.
    onboarding.reiniciar();
    onboarding.estado.nombre = form.nombre.trim();

    const sesion = await login({email: form.email.trim(), password: form.password});
    if (sesion?.success) {
      router.push("/bienvenida/divisa");
    } else {
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: result.message || "Se ha creado el Usuario. Inicia sesión para continuar.",
        life: 4500,
      });
      router.push("/");
    }
  } catch {
    errorServidor.value = "No pudimos conectar con el servidor. Inténtalo de nuevo.";
  }
}
</script>

<template>
  <!-- Pasos 1 y 2: formulario + panel informativo -->
  <AuthSplit v-if="paso < 3" :info-start="paso === 1 ? 2 : 3" :ancho="440">
    <template #cabecera>
      <div class="row between" style="max-width: 440px; width: 100%">
        <img :src="logo" alt="MonyMonty" style="height: 40px; width: auto" />
        <router-link to="/" class="t-sm">Ya tengo cuenta</router-link>
      </div>
    </template>

    <div class="col gap-3">
      <div class="row between t-xs">
        <b>Paso {{ paso }} de {{ TOTAL_PASOS }} · {{ paso === 1 ? "Tus datos" : "Acceso" }}</b>
        <span class="muted">Siguiente: {{ paso === 1 ? "acceso" : "plan" }}</span>
      </div>
      <div class="mm-steps"><i :class="paso > 1 ? 'done' : 'on'"></i><i :class="paso === 2 ? 'on' : ''"></i><i></i></div>
    </div>

    <!-- Paso 1 · Tus datos -->
    <form v-if="paso === 1" class="col gap-6" novalidate @submit.prevent="siguiente">
      <div class="col gap-1">
        <h1 class="t-h1">Cuéntanos de ti</h1>
        <p class="muted">Con esto personalizamos consejos y lecciones. Nada se comparte.</p>
      </div>

      <div class="grid g2" style="gap: 16px">
        <div class="mm-field">
          <label for="reg-nombre">Nombre</label>
          <div class="mm-input" :class="{'is-error': verError1('nombre')}">
            <input id="reg-nombre" v-model="form.nombre" autocomplete="given-name" :aria-invalid="Boolean(verError1('nombre'))" />
          </div>
          <span v-if="verError1('nombre')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError1("nombre") }}</span>
        </div>
        <div class="mm-field">
          <label for="reg-apellido">Apellido</label>
          <div class="mm-input" :class="{'is-error': verError1('apellido')}">
            <input id="reg-apellido" v-model="form.apellido" autocomplete="family-name" placeholder="Tu apellido" :aria-invalid="Boolean(verError1('apellido'))" />
          </div>
          <span v-if="verError1('apellido')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError1("apellido") }}</span>
        </div>
      </div>

      <div class="mm-field">
        <label for="reg-fecha">Fecha de nacimiento</label>
        <div class="mm-input" :class="{'is-error': verError1('fecha')}" style="position: relative">
          <input
            id="reg-fecha"
            :value="form.fechaTexto"
            inputmode="numeric"
            autocomplete="bday"
            placeholder="DD/MM/AAAA"
            :aria-invalid="Boolean(verError1('fecha'))"
            @input="alEscribirFecha"
          />
          <button type="button" class="mm-btn icon sm ghost" aria-label="Elegir la fecha en el calendario" style="margin-right: -8px" @click="abrirCalendario"><MmIcon i="calendar" :s="18" /></button>
          <!-- Selector de fecha del navegador: se abre con el botón y escribe la fecha en el campo de texto -->
          <input
            ref="selectorFecha"
            type="date"
            tabindex="-1"
            aria-hidden="true"
            min="1900-01-01"
            :max="fechaMaximaISO"
            :value="fechaEnISO"
            style="position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; pointer-events: none"
            @change="alElegirEnCalendario"
          />
        </div>
        <span v-if="verError1('fecha')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError1("fecha") }}</span>
        <span v-else class="mm-help">Debes ser mayor de edad para usar MonyMonty.</span>
      </div>

      <div class="mm-field" role="group" aria-labelledby="reg-genero">
        <span id="reg-genero" class="mm-flabel">Género</span>
        <div class="row" style="flex-wrap: wrap; gap: 8px">
          <button
            v-for="g in GENEROS"
            :key="g"
            type="button"
            class="mm-chip"
            :class="{'is-on': form.genero === g}"
            :aria-pressed="form.genero === g"
            @click="form.genero = g"
          >
            {{ g }}
          </button>
        </div>
        <span v-if="verError1('genero')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError1("genero") }}</span>
      </div>

      <div class="row gap-3">
        <router-link to="/" class="mm-btn lg ghost"><MmIcon i="arrow-back" :s="18" />Volver</router-link>
        <button type="submit" class="mm-btn primary lg grow">Continuar<MmIcon i="arrow-forward" :s="18" /></button>
      </div>
    </form>

    <!-- Paso 2 · Acceso -->
    <form v-else class="col gap-5" style="gap: 20px" novalidate @submit.prevent="siguiente">
      <div class="col gap-1">
        <h1 class="t-h1">Crea tu acceso{{ form.nombre.trim() ? `, ${form.nombre.trim()}` : "" }}</h1>
        <p class="muted">Usarás este correo para entrar y recuperar tu cuenta.</p>
      </div>

      <div class="mm-field">
        <label for="reg-email">Correo electrónico</label>
        <div class="mm-input" :class="{'is-error': verError2('email')}">
          <MmIcon i="mail" :s="18" />
          <input id="reg-email" v-model="form.email" type="email" autocomplete="email" placeholder="tu@correo.co" :aria-invalid="Boolean(verError2('email'))" />
          <span v-if="form.email && !erroresPaso2.email" class="income"><MmIcon i="checkmark-circle" :s="18" /></span>
        </div>
        <span v-if="verError2('email')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError2("email") }}</span>
      </div>

      <div class="mm-field">
        <label for="reg-password">Contraseña</label>
        <div class="mm-input" :class="{'is-error': verError2('password')}">
          <MmIcon i="lock-closed" :s="18" />
          <input
            id="reg-password"
            v-model="form.password"
            :type="verClave ? 'text' : 'password'"
            autocomplete="new-password"
            :aria-invalid="Boolean(verError2('password'))"
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
        <div class="mm-strength" style="margin-top: 4px" aria-hidden="true">
          <i v-for="n in 4" :key="n" :class="{on: n <= fuerza.nivel}" :style="n <= fuerza.nivel ? {background: colorFuerza} : null"></i>
        </div>
        <div class="row between t-xs">
          <b :style="{color: form.password ? colorFuerza : 'var(--ink-muted)'}">{{ form.password ? fuerza.etiqueta : "Escribe una contraseña" }}</b>
          <span class="muted">Cumple las 4 reglas para continuar</span>
        </div>
        <div class="grid g2" style="gap: 6px 16px; margin-top: 4px">
          <span v-for="r in fuerza.reglas" :key="r.texto" class="row gap-1 t-xs" :class="r.ok ? 'income' : 'muted'">
            <MmIcon :i="r.ok ? 'checkmark-circle' : 'add-circle'" :s="14" />{{ r.texto }}
          </span>
        </div>
      </div>

      <div class="mm-field">
        <label for="reg-confirm">Confirma la contraseña</label>
        <div class="mm-input" :class="{'is-error': verError2('confirmPassword')}">
          <MmIcon i="lock-closed" :s="18" />
          <input
            id="reg-confirm"
            v-model="form.confirmPassword"
            :type="verClave ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Repite tu contraseña"
            :aria-invalid="Boolean(verError2('confirmPassword'))"
          />
          <span v-if="coinciden" class="income"><MmIcon i="checkmark-circle" :s="18" /></span>
        </div>
        <span v-if="verError2('confirmPassword')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError2("confirmPassword") }}</span>
      </div>

      <div class="col gap-1">
        <div class="row t-sm" style="align-items: flex-start">
          <input id="reg-legal" v-model="form.acceptLegal" type="checkbox" class="mm-sr-only" />
          <label for="reg-legal" class="mm-check-label" :class="{'is-on': form.acceptLegal}">
            <span class="mm-check" :class="{'is-on': form.acceptLegal}" style="margin-top: 1px">
              <MmIcon v-if="form.acceptLegal" i="checkmark" :s="14" />
            </span>
          </label>
          <span>
            Acepto los
            <a href="#" @click.prevent="showCondiciones = true">Términos y condiciones</a>
            y la
            <a href="#" @click.prevent="showPrivacidad = true">Política de privacidad</a>.
          </span>
        </div>
        <span v-if="verError2('acceptLegal')" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ verError2("acceptLegal") }}</span>
        <TerminosCondicionesDrawer v-model="showCondiciones" con-aceptar @aceptar="form.acceptLegal = true" />
        <PoliticaPrivacidadDrawer v-model="showPrivacidad" />
      </div>

      <div class="row gap-3">
        <button type="button" class="mm-btn lg ghost" @click="atras"><MmIcon i="arrow-back" :s="18" />Atrás</button>
        <button type="submit" class="mm-btn primary lg grow">Continuar<MmIcon i="arrow-forward" :s="18" /></button>
      </div>
    </form>
  </AuthSplit>

  <!-- Paso 3: plan, a pantalla completa -->
  <div v-else class="mm-root" data-theme="light">
    <div style="min-height: 100vh; padding: 32px 24px 48px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; gap: 28px">
      <div class="row between" style="width: 100%; max-width: 1080px; flex-wrap: wrap; gap: 16px">
        <img :src="logo" alt="MonyMonty" style="height: 40px; width: auto" />
        <div class="col gap-1" style="width: 280px; max-width: 100%">
          <div class="row between t-xs"><b>Paso 3 de 3 · Plan</b><span class="muted">Último paso</span></div>
          <div class="mm-steps"><i class="done"></i><i class="done"></i><i class="on"></i></div>
        </div>
      </div>

      <div class="col gap-2 mm-rise" style="text-align: center; align-items: center; max-width: 620px">
        <h1 class="t-h1" style="font-size: 34px; line-height: 40px">Elige cómo quieres empezar</h1>
        <p class="muted">Puedes cambiar de plan cuando quieras desde Configuración. Empezar en Free no tiene costo.</p>
      </div>

      <div v-if="errorServidor" class="mm-banner expense" role="alert" style="width: 100%; max-width: 1080px">
        <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ errorServidor }}</span>
      </div>

      <div role="radiogroup" aria-label="Plan" style="width: 100%; max-width: 1080px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px">
        <button
          v-for="(p, k) in PLANES"
          :key="p.id"
          type="button"
          role="radio"
          :aria-checked="form.plan === p.id"
          class="mm-plan mm-rise"
          :class="{'is-on': form.plan === p.id}"
          :style="{'--i': k + 1, textAlign: 'left', font: 'inherit', color: 'inherit'}"
          @click="form.plan = p.id"
        >
          <span v-if="p.recomendado" class="mm-badge brand" style="position: absolute; top: -12px; left: 20px; box-shadow: var(--shadow-sm)">Recomendado</span>
          <div class="row between">
            <div class="mm-ico sm" :class="p.tono" :style="p.tono ? null : {background: 'var(--surface-2)'}"><MmIcon :i="p.icono" :s="18" /></div>
            <span class="mm-radio" :class="{'is-on': form.plan === p.id}"></span>
          </div>
          <div class="t-h2" style="margin-top: 16px">{{ p.id }}</div>
          <div v-if="p.precio" class="row gap-1" style="align-items: baseline; margin: 6px 0 4px">
            <span class="t-amt-lg">{{ p.precio }}</span><span class="t-sm muted">/ mes</span>
          </div>
          <p class="t-sm muted" :style="p.precio ? null : {marginTop: '6px'}">{{ p.resumen }}</p>
          <div class="divider"></div>
          <div class="col gap-2 t-sm">
            <span v-for="item in p.items" :key="item" class="row gap-2"><MmIcon i="checkmark" :s="16" />{{ item }}</span>
          </div>
        </button>
      </div>

      <div class="row gap-3" style="width: 100%; max-width: 1080px; justify-content: flex-end">
        <button type="button" class="mm-btn lg ghost" :disabled="loading" @click="atras"><MmIcon i="arrow-back" :s="18" />Atrás</button>
        <button type="button" class="mm-btn primary lg" :class="{'is-loading': loading}" :disabled="loading" @click="crearCuenta">
          Crear mi cuenta<MmIcon i="arrow-forward" :s="18" />
        </button>
      </div>

      <FooterAuth />
    </div>
  </div>
</template>

<style scoped>
/* Entrada de teclado accesible: el input real queda oculto y su label dibuja la casilla */
.mm-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
.mm-check-label {
  display: inline-flex;
  margin-right: 8px;
  cursor: pointer;
}
.mm-sr-only:focus-visible + .mm-check-label .mm-check {
  outline: 2px solid var(--brand-strong);
  outline-offset: 2px;
}
</style>
