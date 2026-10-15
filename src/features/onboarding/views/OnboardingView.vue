<script setup>
/**
 * Configuración inicial tras el registro:
 * moneda -> primera cuenta -> categorías -> resumen.
 * La cuenta y las categorías se crean con los mismos endpoints de siempre
 * (POST entidad, POST categoria); la moneda elegida viaja como divisaId de la cuenta.
 */
import {ref, computed, reactive, watch, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";

import {useOnboarding} from "../logic/useOnboarding.js";
import {
  DIVISAS_INFO,
  DIVISAS_POR_DEFECTO,
  TIPOS_CUENTA,
  CATEGORIAS_SUGERIDAS,
  CATEGORIAS_PRESELECCIONADAS,
  COLOR_CATEGORIA_PROPIA,
  ICONO_CATEGORIA_PROPIA,
} from "../logic/onboardingConstants.js";
import {useEntidades} from "@/features/movimientos/logic/CreateEntidad.js";
import {useCategorias} from "@/features/movimientos/logic/CreateCategoria.js";
import {useMovimientoOptions} from "@/features/movimientos/logic/OptionsMovimiento.js";
import logo from "../../../assets/img/MonyMontySinFondo3.png";
import MmIcon from "@/components/mm/MmIcon.vue";

const route = useRoute();
const router = useRouter();
const {estado, cargarNombre} = useOnboarding();
const {createEntidad, loading: guardandoCuenta} = useEntidades();
const {createCategoria, loading: guardandoCategorias} = useCategorias();
const {divisas, fetchOptions} = useMovimientoOptions();

const PASOS = ["divisa", "cuenta", "categorias", "listo"];
const paso = computed(() => route.params.paso);
const numeroPaso = computed(() => PASOS.indexOf(paso.value) + 1);
const irA = (p) => router.push(`/bienvenida/${p}`);
const omitir = () => router.push("/tablero");

onMounted(() => {
  cargarNombre();
  fetchOptions();
});

// ---------- Paso 1 · Moneda ----------
const listaDivisas = computed(() => (divisas.value?.length ? divisas.value : DIVISAS_POR_DEFECTO));

// Si la API no incluye la moneda por defecto, se parte de la primera disponible
watch(
  listaDivisas,
  (lista) => {
    if (!lista.some((d) => d.value === estado.divisaId)) estado.divisaId = lista[0].value;
  },
  {immediate: true}
);

const infoDivisa = (codigo) => DIVISAS_INFO[codigo] ?? {nombre: codigo, simbolo: codigo, locale: "es-CO", tono: "", muestra: DIVISAS_INFO.USD.muestra};
const divisaActual = computed(() => infoDivisa(estado.divisaId));

function formatoMoneda(valor, codigo = estado.divisaId) {
  const {locale} = infoDivisa(codigo);
  const sinDecimales = codigo === "COP";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: codigo,
      minimumFractionDigits: sinDecimales ? 0 : 2,
      maximumFractionDigits: sinDecimales ? 0 : 2,
    }).format(valor);
  } catch {
    // Código de divisa que Intl no conoce
    return `${codigo} ${new Intl.NumberFormat("es-CO").format(valor)}`;
  }
}

// ---------- Paso 2 · Cuenta ----------
const cuenta = reactive({tipo: "BANCO", nombre: "", numero: "", saldoTxt: ""});
const errorCuenta = ref("");
const intentoCuenta = ref(false);

const tipoActual = computed(() => TIPOS_CUENTA.find((t) => t.value === cuenta.tipo));
const saldo = computed(() => Number(cuenta.saldoTxt.replace(/\D/g, "")) || 0);
const cuentaYaCreada = computed(() => Boolean(estado.cuenta));
const errorNombreCuenta = computed(() => (intentoCuenta.value && cuenta.nombre.trim().length < 2 ? "El nombre debe tener al menos 2 caracteres" : ""));

function alEscribirSaldo(e) {
  const digitos = e.target.value.replace(/\D/g, "").slice(0, 13);
  cuenta.saldoTxt = digitos ? new Intl.NumberFormat("es-CO").format(Number(digitos)) : "";
  e.target.value = cuenta.saldoTxt;
}

function alEscribirNumero(e) {
  cuenta.numero = e.target.value.replace(/\D/g, "").slice(0, 4);
  e.target.value = cuenta.numero;
}

async function guardarCuenta() {
  errorCuenta.value = "";

  // La cuenta ya existe en la API (volvieron atrás): no se duplica
  if (cuentaYaCreada.value) return irA("categorias");

  intentoCuenta.value = true;
  if (errorNombreCuenta.value || cuenta.nombre.trim().length < 2) return;

  const datos = {
    nombre: cuenta.nombre.trim(),
    tipo: cuenta.tipo,
    numero: cuenta.tipo === "EFECTIVO" ? "" : cuenta.numero,
    saldoInicial: saldo.value,
    divisaId: estado.divisaId,
  };

  try {
    await createEntidad(datos);
    estado.cuenta = {nombre: datos.nombre, tipo: datos.tipo, saldoInicial: datos.saldoInicial, divisaId: datos.divisaId};
    irA("categorias");
  } catch (err) {
    errorCuenta.value = err.response?.data?.message || "No se pudo crear la cuenta. Intenta nuevamente.";
  }
}

// ---------- Paso 3 · Categorías ----------
const catalogo = ref([...CATEGORIAS_SUGERIDAS]);
const elegidas = ref(new Set(estado.categoriasElegidas.length ? estado.categoriasElegidas : CATEGORIAS_PRESELECCIONADAS));
const errorCategorias = ref("");
const creandoPropia = ref(false);
const nombrePropia = ref("");

const totalElegidas = computed(() => elegidas.value.size);

function alternar(clave) {
  const siguiente = new Set(elegidas.value);
  siguiente.has(clave) ? siguiente.delete(clave) : siguiente.add(clave);
  elegidas.value = siguiente;
}

function agregarPropia() {
  const nombre = nombrePropia.value.trim();
  if (nombre.length < 2) return;

  const clave = `propia-${nombre.toLowerCase()}`;
  if (!catalogo.value.some((c) => c.clave === clave || c.nombre.toLowerCase() === nombre.toLowerCase())) {
    catalogo.value.push({clave, nombre, icono: ICONO_CATEGORIA_PROPIA, color: COLOR_CATEGORIA_PROPIA});
  }
  elegidas.value = new Set([...elegidas.value, clave]);
  nombrePropia.value = "";
  creandoPropia.value = false;
}

async function terminar() {
  errorCategorias.value = "";
  estado.categoriasElegidas = [...elegidas.value];

  const pendientes = catalogo.value.filter((c) => elegidas.value.has(c.clave) && !estado.categoriasCreadas.includes(c.clave));
  const fallidas = [];

  // Una por una: la API dispara un refresco global tras cada alta
  for (const c of pendientes) {
    try {
      await createCategoria({
        nombreCategoria: c.nombre,
        icono: `ion:${c.icono}-outline`,
        color: c.color,
        nota: "Creada en la configuración inicial",
      });
      estado.categoriasCreadas.push(c.clave);
    } catch {
      fallidas.push(c.nombre);
    }
  }

  if (fallidas.length) {
    errorCategorias.value = `No se pudieron crear: ${fallidas.join(", ")}. Puedes reintentar o continuar y crearlas luego.`;
    return;
  }
  irA("listo");
}

// ---------- Paso 4 · Resumen ----------
const categoriasCreadasInfo = computed(() => catalogo.value.filter((c) => estado.categoriasCreadas.includes(c.clave)));
const resumenCategorias = computed(() => {
  const nombres = categoriasCreadasInfo.value.map((c) => c.nombre);
  if (nombres.length <= 4) return nombres.join(", ");
  return `${nombres.slice(0, 4).join(", ")} y ${nombres.length - 4} más`;
});
const tipoCuentaResumen = computed(() => TIPOS_CUENTA.find((t) => t.value === estado.cuenta?.tipo));
</script>

<template>
  <div class="mm-root" data-theme="light">
    <!-- Pasos 1 a 3 -->
    <div v-if="numeroPaso < 4" style="min-height: 100vh; display: flex; flex-direction: column">
      <header style="display: flex; flex-wrap: wrap; align-items: center; gap: 24px; padding: 24px 40px">
        <img :src="logo" alt="MonyMonty" style="height: 38px; width: auto" />
        <div class="grow" style="max-width: 420px; margin: 0 auto">
          <div class="row between t-xs" style="margin-bottom: 6px">
            <b>Configura tu espacio · {{ numeroPaso }} de 3</b>
            <span class="muted">{{ ["≈ 1 minuto", "Casi listo", "Último paso"][numeroPaso - 1] }}</span>
          </div>
          <div class="mm-steps">
            <i :class="numeroPaso > 1 ? 'done' : 'on'"></i>
            <i :class="numeroPaso > 2 ? 'done' : numeroPaso === 2 ? 'on' : ''"></i>
            <i :class="numeroPaso === 3 ? 'on' : ''"></i>
          </div>
        </div>
        <a href="#" class="t-sm" style="color: var(--ink-muted)" @click.prevent="omitir">Omitir por ahora</a>
      </header>

      <!-- Moneda -->
      <main v-if="paso === 'divisa'" style="flex: 1; display: flex; flex-wrap: wrap; gap: 48px; align-items: center; justify-content: center; padding: 24px 40px 48px">
        <div class="col gap-6" style="flex: 1 1 480px; max-width: 560px">
          <div class="col gap-2 mm-rise">
            <span v-if="estado.nombre" class="mm-badge brand" style="align-self: flex-start">Hola, {{ estado.nombre }}</span>
            <h1 class="t-h1" style="font-size: 34px; line-height: 40px">¿En qué moneda manejas tu plata?</h1>
            <p class="muted">Será la moneda de tu primera cuenta. Podrás registrar movimientos en otras cuando viajes.</p>
          </div>

          <div role="radiogroup" aria-label="Moneda principal" class="grid g2 mm-rise" style="--i: 1; gap: 12px">
            <button
              v-for="d in listaDivisas"
              :key="d.value"
              type="button"
              role="radio"
              :aria-checked="estado.divisaId === d.value"
              class="mm-plan"
              :class="{'is-on': estado.divisaId === d.value}"
              style="text-align: left; font: inherit; color: inherit; padding: 16px"
              @click="estado.divisaId = d.value"
            >
              <div class="row gap-3">
                <div class="mm-avatar" :style="{borderRadius: '12px', ...(infoDivisa(d.value).tono ? {background: `var(--${infoDivisa(d.value).tono}-tint)`, color: `var(--${infoDivisa(d.value).tono})`} : {})}">
                  {{ infoDivisa(d.value).simbolo }}
                </div>
                <div class="grow">
                  <b>{{ infoDivisa(d.value).nombre }}</b>
                  <div class="t-xs muted">{{ d.value }} · {{ formatoMoneda(infoDivisa(d.value).muestra.saldo, d.value) }}</div>
                </div>
                <span class="mm-radio" :class="{'is-on': estado.divisaId === d.value}"></span>
              </div>
            </button>
          </div>

          <div class="row gap-3 mm-rise" style="--i: 3">
            <button type="button" class="mm-btn primary lg" @click="irA('cuenta')">Continuar<MmIcon i="arrow-forward" :s="18" /></button>
            <span class="t-xs muted">La moneda queda guardada en tu primera cuenta.</span>
          </div>
        </div>

        <div class="mm-card mm-rise" style="--i: 2; flex: 0 1 380px; padding: 28px; box-shadow: var(--shadow-lg)">
          <div class="t-over">Vista previa</div>
          <div class="t-amt-xl" style="margin: 12px 0 4px">{{ formatoMoneda(divisaActual.muestra.saldo) }}</div>
          <div class="t-sm muted">Así verás tu saldo disponible</div>
          <div class="divider"></div>
          <div class="mm-row">
            <div class="mm-ico cat sm" style="background: var(--cat-orange)"><MmIcon i="fast-food" :s="18" /></div>
            <div class="grow"><div class="t">Almuerzo</div><div class="s">Comida</div></div>
            <span class="t-amt">− {{ formatoMoneda(divisaActual.muestra.gasto) }}</span>
          </div>
          <div class="mm-row">
            <div class="mm-ico cat sm" style="background: var(--cat-green)"><MmIcon i="briefcase" :s="18" /></div>
            <div class="grow"><div class="t">Salario</div><div class="s">Ingreso</div></div>
            <span class="t-amt income">+ {{ formatoMoneda(divisaActual.muestra.ingreso) }}</span>
          </div>
        </div>
      </main>

      <!-- Primera cuenta -->
      <main v-else-if="paso === 'cuenta'" style="flex: 1; display: flex; flex-wrap: wrap; gap: 48px; align-items: center; justify-content: center; padding: 24px 40px 48px">
        <form class="col gap-5" style="flex: 1 1 480px; max-width: 560px; gap: 22px" novalidate @submit.prevent="guardarCuenta">
          <div class="col gap-2 mm-rise">
            <h1 class="t-h1" style="font-size: 34px; line-height: 40px">Agrega tu primera cuenta</h1>
            <p class="muted">Donde tienes tu plata hoy. Con su saldo real, tu tablero arranca con datos de verdad.</p>
          </div>

          <div v-if="cuentaYaCreada" class="mm-banner income" role="status">
            <MmIcon i="checkmark-circle" :s="18" /><span class="grow">Tu cuenta “{{ estado.cuenta.nombre }}” ya quedó guardada.</span>
          </div>
          <div v-if="errorCuenta" class="mm-banner expense" role="alert">
            <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ errorCuenta }}</span>
          </div>

          <div class="mm-field mm-rise" style="--i: 1" role="radiogroup" aria-labelledby="ob-tipo">
            <span id="ob-tipo" class="mm-flabel">Tipo de cuenta</span>
            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px">
              <button
                v-for="t in TIPOS_CUENTA"
                :key="t.value"
                type="button"
                role="radio"
                :aria-checked="cuenta.tipo === t.value"
                class="mm-plan"
                :class="{'is-on': cuenta.tipo === t.value}"
                :disabled="cuentaYaCreada"
                style="padding: 14px 10px; font: inherit; color: inherit; display: flex; flex-direction: column; align-items: center; gap: 8px"
                @click="cuenta.tipo = t.value"
              >
                <MmIcon :i="t.icono" :s="22" /><b class="t-sm">{{ t.label }}</b>
              </button>
            </div>
          </div>

          <div class="grid g2 mm-rise" style="--i: 2; gap: 16px">
            <div class="mm-field">
              <label for="ob-nombre">Nombre</label>
              <div class="mm-input" :class="{'is-error': errorNombreCuenta}">
                <input id="ob-nombre" v-model="cuenta.nombre" placeholder="Ej: Bancolombia Ahorros, Efectivo, Nequi" :disabled="cuentaYaCreada || guardandoCuenta" :aria-invalid="Boolean(errorNombreCuenta)" />
              </div>
              <span v-if="errorNombreCuenta" class="mm-err"><MmIcon i="alert-circle" :s="14" />{{ errorNombreCuenta }}</span>
            </div>
            <div v-if="cuenta.tipo !== 'EFECTIVO'" class="mm-field">
              <label for="ob-numero">Últimos 4 dígitos</label>
              <div class="mm-input">
                <input id="ob-numero" :value="cuenta.numero" inputmode="numeric" placeholder="Opcional" :disabled="cuentaYaCreada || guardandoCuenta" @input="alEscribirNumero" />
              </div>
            </div>
          </div>

          <div class="mm-field mm-rise" style="--i: 3">
            <label for="ob-saldo">¿Cuánto tienes hoy?</label>
            <div class="mm-input amount">
              <span class="muted" style="font-size: 22px">{{ divisaActual.simbolo }}</span>
              <input id="ob-saldo" :value="cuenta.saldoTxt" inputmode="numeric" placeholder="0" style="font-size: 32px" :disabled="cuentaYaCreada || guardandoCuenta" @input="alEscribirSaldo" />
              <span class="mm-badge">{{ estado.divisaId }}</span>
            </div>
            <span class="mm-help">No necesitas el valor exacto al peso. Lo ajustas luego.</span>
          </div>

          <div class="row gap-3 mm-rise" style="--i: 4">
            <button type="button" class="mm-btn lg ghost" :disabled="guardandoCuenta" @click="irA('divisa')"><MmIcon i="arrow-back" :s="18" />Atrás</button>
            <button type="submit" class="mm-btn primary lg" :class="{'is-loading': guardandoCuenta}" :disabled="guardandoCuenta">
              Guardar y seguir<MmIcon i="arrow-forward" :s="18" />
            </button>
          </div>
        </form>

        <div class="col gap-4 mm-rise" style="--i: 2; flex: 0 1 380px">
          <div class="t-over">Vista previa en vivo</div>
          <div
            :style="{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '22px',
              padding: '24px',
              minHeight: '210px',
              color: '#fff',
              background: tipoActual.color,
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'background var(--dur-slow) var(--ease-out)',
            }"
          >
            <div style="position: absolute; width: 220px; height: 220px; border-radius: 50%; right: -60px; top: -80px; background: rgba(255, 255, 255, 0.14)"></div>
            <div style="position: absolute; width: 140px; height: 140px; border-radius: 50%; right: 40px; bottom: -70px; background: rgba(255, 255, 255, 0.1)"></div>
            <div class="row between" style="position: relative"><b>{{ cuenta.nombre.trim() || "Nueva cuenta" }}</b><MmIcon :i="tipoActual.icono" :s="24" /></div>
            <div style="position: relative">
              <div class="t-xs" style="opacity: 0.85">Saldo actual</div>
              <div class="t-amt-xl">{{ formatoMoneda(saldo) }}</div>
              <div class="t-sm" style="opacity: 0.85; margin-top: 6px">
                {{ tipoActual.label }}<template v-if="cuenta.tipo !== 'EFECTIVO' && cuenta.numero"> · •••• {{ cuenta.numero }}</template>
              </div>
            </div>
          </div>
          <div class="mm-banner info"><MmIcon i="information-circle" :s="18" /><span>Con esta cuenta podrás registrar tus primeros movimientos.</span></div>
        </div>
      </main>

      <!-- Categorías -->
      <main v-else style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 28px; padding: 16px 40px 48px">
        <div class="col gap-2 mm-rise" style="text-align: center; align-items: center; max-width: 640px">
          <h1 class="t-h1" style="font-size: 34px; line-height: 40px">¿En qué se te va la plata?</h1>
          <p class="muted">Elige las categorías que usarás. Te sugerimos las más comunes; las editas o creas nuevas cuando quieras.</p>
        </div>

        <div v-if="errorCategorias" class="mm-banner expense" role="alert" style="width: 100%; max-width: 920px">
          <MmIcon i="alert-circle" :s="18" /><span class="grow">{{ errorCategorias }}</span>
        </div>

        <div style="width: 100%; max-width: 920px; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px">
          <button
            v-for="(c, k) in catalogo"
            :key="c.clave"
            type="button"
            role="checkbox"
            :aria-checked="elegidas.has(c.clave)"
            class="mm-plan mm-rise"
            :class="{'is-on': elegidas.has(c.clave)}"
            :disabled="guardandoCategorias || estado.categoriasCreadas.includes(c.clave)"
            :style="{'--i': k, padding: '14px', font: 'inherit', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left'}"
            @click="alternar(c.clave)"
          >
            <div class="mm-ico cat sm" :style="{background: c.color}"><MmIcon :i="c.icono" :s="18" /></div>
            <span class="grow t-label" style="font-size: 14px">{{ c.nombre }}</span>
            <span class="mm-check" :class="{'is-on': elegidas.has(c.clave)}"><MmIcon v-if="elegidas.has(c.clave)" i="checkmark" :s="14" /></span>
          </button>

          <form v-if="creandoPropia" class="mm-plan" style="padding: 8px 8px 8px 14px; display: flex; align-items: center; gap: 8px; border-style: dashed" @submit.prevent="agregarPropia">
            <input v-model="nombrePropia" aria-label="Nombre de la categoría" placeholder="Nombre" maxlength="40" style="flex: 1; min-width: 0; border: 0; background: none; outline: 0; font-size: 14px; font-weight: 700" />
            <button type="submit" class="mm-btn sm primary" :disabled="nombrePropia.trim().length < 2">Agregar</button>
          </form>
          <button
            v-else
            type="button"
            class="mm-plan"
            :disabled="guardandoCategorias"
            style="padding: 14px; font: inherit; color: var(--brand-ink); display: flex; align-items: center; gap: 12px; border-style: dashed; background: transparent"
            @click="creandoPropia = true"
          >
            <div class="mm-ico sm brand"><MmIcon i="add" :s="18" /></div><b class="t-label" style="font-size: 14px">Crear otra</b>
          </button>
        </div>

        <div class="row gap-4" style="width: 100%; max-width: 920px; flex-wrap: wrap">
          <span class="mm-badge brand">{{ totalElegidas }} seleccionadas</span>
          <span class="t-xs muted grow">Podrás editarlas o crear subcategorías desde el tablero.</span>
          <button type="button" class="mm-btn lg ghost" :disabled="guardandoCategorias" @click="irA('cuenta')"><MmIcon i="arrow-back" :s="18" />Atrás</button>
          <button type="button" class="mm-btn primary lg" :class="{'is-loading': guardandoCategorias}" :disabled="guardandoCategorias" @click="terminar">
            {{ errorCategorias ? "Reintentar" : "Terminar" }}<MmIcon i="checkmark" :s="18" />
          </button>
          <button v-if="errorCategorias" type="button" class="mm-btn lg" @click="irA('listo')">Continuar de todos modos</button>
        </div>
      </main>
    </div>

    <!-- Todo listo -->
    <div v-else class="mm-center" style="position: relative; overflow: hidden">
      <i class="mm-popin" style="--i: 3; position: absolute; left: 22%; top: 18%; width: 14px; height: 14px; border-radius: 4px; background: var(--brand); transform: rotate(20deg)"></i>
      <i class="mm-popin" style="--i: 5; position: absolute; left: 30%; top: 70%; width: 10px; height: 10px; border-radius: 50%; background: var(--balance)"></i>
      <i class="mm-popin" style="--i: 7; position: absolute; right: 26%; top: 22%; width: 12px; height: 12px; border-radius: 50%; background: var(--income)"></i>
      <i class="mm-popin" style="--i: 9; position: absolute; right: 20%; top: 64%; width: 16px; height: 16px; border-radius: 5px; background: var(--warning); transform: rotate(-15deg)"></i>
      <i class="mm-popin" style="--i: 11; position: absolute; left: 44%; top: 10%; width: 8px; height: 8px; border-radius: 50%; background: var(--info)"></i>
      <div class="mm-float" style="position: absolute; width: 560px; height: 560px; border-radius: 50%; left: 50%; top: 50%; margin: -320px 0 0 -280px; background: var(--brand-tint); opacity: 0.8"></div>

      <div class="mm-card mm-rise" style="position: relative; width: min(520px, 100%); padding: 40px; box-shadow: var(--shadow-lg); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 22px">
        <svg class="mm-success-check" width="104" height="104" viewBox="0 0 112 112" aria-hidden="true"><circle cx="56" cy="56" r="56"></circle><path d="M36 58l14 14 26-30"></path></svg>
        <div class="col gap-2">
          <h1 class="t-h1" style="font-size: 32px; line-height: 38px">¡Todo listo{{ estado.nombre ? `, ${estado.nombre}` : "" }}!</h1>
          <p class="muted">Tu espacio está configurado. El siguiente paso que más ayuda: registrar lo que gastaste hoy.</p>
        </div>

        <div class="col" style="width: 100%; gap: 0; text-align: left">
          <div class="mm-row mm-rise" style="--i: 4; margin: 0">
            <div class="mm-ico sm brand"><MmIcon i="globe" :s="18" /></div>
            <div class="grow"><div class="t">Moneda principal</div><div class="s">{{ divisaActual.nombre }} · {{ estado.divisaId }}</div></div>
            <span class="income"><MmIcon i="checkmark-circle" :s="20" /></span>
          </div>
          <div v-if="estado.cuenta" class="mm-row mm-rise" style="--i: 5; margin: 0">
            <div class="mm-ico sm cat" :style="{background: tipoCuentaResumen?.color}"><MmIcon :i="tipoCuentaResumen?.icono ?? 'wallet'" :s="18" /></div>
            <div class="grow"><div class="t">{{ estado.cuenta.nombre }}</div><div class="s">{{ formatoMoneda(estado.cuenta.saldoInicial, estado.cuenta.divisaId) }}</div></div>
            <span class="income"><MmIcon i="checkmark-circle" :s="20" /></span>
          </div>
          <div v-if="categoriasCreadasInfo.length" class="mm-row mm-rise" style="--i: 6; margin: 0">
            <div class="mm-ico sm info"><MmIcon i="pricetags" :s="18" /></div>
            <div class="grow">
              <div class="t">{{ categoriasCreadasInfo.length }} {{ categoriasCreadasInfo.length === 1 ? "categoría" : "categorías" }}</div>
              <div class="s">{{ resumenCategorias }}</div>
            </div>
            <span class="income"><MmIcon i="checkmark-circle" :s="20" /></span>
          </div>
        </div>

        <router-link to="/tablero" class="mm-btn primary lg block"><MmIcon i="arrow-forward" :s="20" />Ir a mi tablero</router-link>
      </div>
    </div>
  </div>
</template>
