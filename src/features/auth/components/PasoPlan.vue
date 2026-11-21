<script setup>
/**
    Elección de plan 
 */
import {ref, computed} from "vue";
import {Icon} from "@iconify/vue";
import {DateTime} from "luxon";

import logo from "../../../assets/img/MonyMontySinFondo3.png";
import PasosRegistro from "./PasosRegistro.vue";
import {PLANES_REGISTRO, PERIODOS, TRIAL_DIAS} from "../logic/registroConstants.js";

const plan = defineModel("plan", {type: String, required: true});
defineProps({
  cargando: {type: Boolean, default: false},
});
defineEmits(["atras", "crear"]);

const periodo = ref(PERIODOS[0].id);
const indicePeriodo = computed(() => PERIODOS.findIndex((p) => p.id === periodo.value));
const esAnual = computed(() => periodo.value === "anual");

const tarjetas = computed(() =>
  PLANES_REGISTRO.map((p) => ({
    ...p,
    precio: p.gratis ? "$ 0" : esAnual.value ? p.anual : p.mensual,
    cadencia: p.gratis ? "para siempre" : esAnual.value ? "/ año" : "/ mes",
    nota: p.gratis ? "" : esAnual.value ? `Equivale a ${p.equivalenteMensual} al mes` : `O ${p.anual} al año`,
    activo: p.id === plan.value,
  }))
);

const elegido = computed(() => PLANES_REGISTRO.find((p) => p.id === plan.value));

// Fecha en la que termina la prueba gratis de los planes de pago
const finDePrueba = DateTime.now().plus({days: TRIAL_DIAS}).setLocale("es-CO").toLocaleString({day: "numeric", month: "long"});

const textoBoton = computed(() =>
  elegido.value.gratis ? "Crear mi cuenta gratis" : `Probar ${elegido.value.nombre} ${TRIAL_DIAS} días gratis`
);
const textoInfo = computed(() =>
  elegido.value.gratis
    ? "Puedes pasar a Basic cuando quieras desde Configuración."
    : `No te cobramos hoy. El ${finDePrueba} te recordamos que termina la prueba; si no pagas, tu cuenta sigue en Free con todos tus datos.`
);
</script>

<template>
  <div class="tema" data-theme="light">
    <div class="paso-plan">
      <div class="row between paso-plan-ancho">
        <img :src="logo" alt="MonyMonty" style="height: 40px; width: auto" />
        <div style="width: 280px; max-width: 50%">
          <PasosRegistro :paso="3" />
        </div>
      </div>

      <div class="col gap-2 rise" style="text-align: center; align-items: center; max-width: 660px">
        <h1 class="t-h1" style="font-size: 34px; line-height: 40px">Elige cómo quieres empezar</h1>
        <p class="muted">
          Empezar en Gratis no cuesta nada. Si eliges Basico, lo pruebas <b style="color: var(--ink)">{{ TRIAL_DIAS }} días gratis</b> y
          decides antes de pagar.
        </p>
        <div
          class="segmentado"
          role="group"
          aria-label="Periodo de cobro"
          :style="{'--n': PERIODOS.length, '--on': indicePeriodo, marginTop: '8px'}"
        >
          <i class="thumb"></i>
          <button
            v-for="p in PERIODOS"
            :key="p.id"
            type="button"
            :class="{'is-on': p.id === periodo}"
            :aria-pressed="p.id === periodo"
            @click="periodo = p.id"
          >
            {{ p.etiqueta }}
          </button>
        </div>
      </div>

      <div class="planes" role="radiogroup" aria-label="Planes disponibles">
        <button
          v-for="(p, k) in tarjetas"
          :key="p.id"
          type="button"
          role="radio"
          class="plan rise"
          :class="{'is-on': p.activo}"
          :aria-checked="p.activo"
          :style="{'--i': k + 1}"
          @click="plan = p.id"
        >
          <span v-if="p.insignia" class="badge info insignia">{{ p.insignia }}</span>
          <span class="row between">
            <span class="ico sm" :class="p.tono"><Icon :icon="p.icono" :width="18" :height="18" /></span>
            <span class="radio" :class="{'is-on': p.activo}"></span>
          </span>
          <span class="t-h2 bloque" style="margin-top: 14px">{{ p.nombre }}</span>
          <span class="row gap-1" style="align-items: baseline; margin: 6px 0 2px">
            <span class="t-amt-lg">{{ p.precio }}</span>
            <span class="t-sm muted">{{ p.cadencia }}</span>
          </span>
          <span class="t-xs muted bloque" style="min-height: 16px">{{ p.nota }}</span>
          <span class="t-sm muted bloque" style="margin-top: 6px; min-height: 40px">{{ p.descripcion }}</span>
          <hr class="divider" />
          <span class="col gap-2 t-sm">
            <span v-for="c in p.caracteristicas" :key="c" class="row gap-2" style="align-items: flex-start">
              <span class="income" style="flex: none"><Icon icon="ion:checkmark-outline" :width="16" :height="16" /></span>{{ c }}
            </span>
          </span>
        </button>
      </div>

      <div class="banner info rise paso-plan-ancho" style="--i: 3">
        <Icon icon="ion:information-circle-outline" :width="18" :height="18" />
        <span class="t-sm">{{ textoInfo }}</span>
      </div>

      <div class="row gap-3 paso-plan-ancho" style="justify-content: flex-end">
        <button type="button" class="btn lg ghost" :disabled="cargando" @click="$emit('atras')">
          <Icon icon="ion:arrow-back-outline" :width="18" :height="18" />Atrás
        </button>
        <button type="button" class="btn primary lg" :class="{'is-loading': cargando}" :disabled="cargando" @click="$emit('crear')">
          {{ textoBoton }}<Icon icon="ion:arrow-forward-outline" :width="18" :height="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.paso-plan {
  min-height: 100vh;
  min-height: 100dvh;
  padding: 32px 24px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
}

.paso-plan-ancho {
  width: 100%;
  max-width: 820px;
}

.planes {
  width: 100%;
  max-width: 820px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 18px;
}

/* El plan es un <button>: se reinician sus estilos para que se lea como tarjeta */
.planes .plan {
  display: block;
  text-align: left;
  font: inherit;
  color: inherit;
}

.bloque {
  display: block;
}

.insignia {
  position: absolute;
  top: -12px;
  left: 20px;
  box-shadow: var(--shadow-sm);
}

.ico.neutro {
  background: var(--surface-2);
  color: var(--ink);
}
</style>
