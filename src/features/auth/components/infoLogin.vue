<script setup>
/**
 * Panel informativo del acceso: carrusel de 5 tarjetas (qué es la app, promesa y 3 características).
 * `start` permite que cada pantalla abra en una tarjeta distinta.
 */
import {ref, computed, onMounted, onBeforeUnmount} from "vue";
import {Icon} from "@iconify/vue";

const props = defineProps({
  start: {type: Number, default: 0},
});

const TITULOS = ["¿Qué es nuestra aplicación?", "Nuestra promesa", "Asesorías personalizadas", "Asesorías grupales", "Gestión moderna"];
const INTERVALO_MS = 8000;

const actual = ref(props.start % TITULOS.length);
let timer = null;

const dots = computed(() => TITULOS.map((label, k) => ({label, activo: k === actual.value})));

function programar() {
  clearInterval(timer);
  timer = setInterval(() => {
    actual.value = (actual.value + 1) % TITULOS.length;
  }, INTERVALO_MS);
}

function ir(n) {
  actual.value = (n + TITULOS.length) % TITULOS.length;
  // Tras una acción manual se reinicia el reloj para no saltar de tarjeta enseguida
  programar();
}

onMounted(programar);
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <aside class="auth-info" aria-label="Sobre MonyMonty" aria-live="polite" style="min-height: calc(100vh - 32px); justify-content: space-between; gap: 24px">
    <div class="float" style="position: absolute; width: 360px; height: 360px; border-radius: 50%; right: -150px; top: -150px; background: var(--brand-tint)"></div>
    <div class="float" style="position: absolute; width: 200px; height: 200px; border-radius: 50%; left: -90px; bottom: -90px; background: var(--balance-tint); animation-delay: -3s"></div>

    <div style="position: relative; flex: 1; display: flex; flex-direction: column; justify-content: center">
      <!-- 0 · Qué es -->
      <div v-if="actual === 0" :key="0" class="col" style="gap: 24px">
        <span class="badge brand rise" style="align-self: flex-start"><Icon icon="ion:sparkles-outline" :width="12" :height="12" />Conócenos</span>
        <h2 class="rise" style="--i: 1">¿Qué es nuestra aplicación?</h2>
        <p class="muted rise" style="--i: 2; font-size: 18px; line-height: 29px">
          Una innovadora solución <strong style="color: var(--ink)">SaaS</strong> para gestionar tus finanzas personales de forma
          <strong style="color: var(--ink)">eficiente</strong> y <strong style="color: var(--ink)">sencilla</strong>.
        </p>
        <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px">
          <div class="card popin" style="--i: 3; padding: 16px; box-shadow: none">
            <div class="ico sm balance"><Icon icon="ion:layers-outline" :width="18" :height="18" /></div>
            <b class="t-h3" style="display: block; margin-top: 12px">SaaS</b>
            <span class="t-xs muted">Sin instalar nada, desde cualquier dispositivo</span>
          </div>
          <div class="card popin" style="--i: 4; padding: 16px; box-shadow: none">
            <div class="ico sm brand"><Icon icon="ion:time-outline" :width="18" :height="18" /></div>
            <b class="t-h3" style="display: block; margin-top: 12px">Eficiente</b>
            <span class="t-xs muted">Registra un gasto en segundos</span>
          </div>
          <div class="card popin" style="--i: 5; padding: 16px; box-shadow: none">
            <div class="ico sm income"><Icon icon="ion:checkmark-circle-outline" :width="18" :height="18" /></div>
            <b class="t-h3" style="display: block; margin-top: 12px">Sencilla</b>
            <span class="t-xs muted">Todo tu dinero en un vistazo</span>
          </div>
        </div>
      </div>

      <!-- 1 · Promesa -->
      <div v-else-if="actual === 1" :key="1" class="col" style="gap: 28px">
        <span class="badge brand rise" style="align-self: flex-start"><Icon icon="ion:flag-outline" :width="12" :height="12" />Nuestra promesa</span>
        <blockquote class="auth-quote rise" style="--i: 1; font-size: 30px; line-height: 40px; padding: 28px 30px">
          "Tu camino hacia la <strong>libertad financiera</strong> comienza aquí."
        </blockquote>
        <div style="position: relative; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; text-align: center">
          <div style="position: absolute; left: 12%; right: 12%; top: 21px; height: 3px; border-radius: 3px; background: var(--line)"></div>
          <div style="position: absolute; left: 12%; right: 12%; top: 21px; height: 3px; border-radius: 3px; background: var(--brand); transform-origin: left; animation: grow-x 1.6s var(--ease-out) 0.5s both"></div>
          <div class="col popin" style="--i: 3; align-items: center; gap: 8px; position: relative">
            <div class="ico sm" style="background: var(--surface); border: 2px solid var(--brand); color: var(--brand-ink)"><Icon icon="ion:add-outline" :width="18" :height="18" /></div>
            <b class="t-sm">Registra</b>
          </div>
          <div class="col popin" style="--i: 5; align-items: center; gap: 8px; position: relative">
            <div class="ico sm" style="background: var(--surface); border: 2px solid var(--brand); color: var(--brand-ink)"><Icon icon="ion:pie-chart-outline" :width="18" :height="18" /></div>
            <b class="t-sm">Entiende</b>
          </div>
          <div class="col popin" style="--i: 7; align-items: center; gap: 8px; position: relative">
            <div class="ico sm" style="background: var(--surface); border: 2px solid var(--brand); color: var(--brand-ink)"><Icon icon="ion:bulb-outline" :width="18" :height="18" /></div>
            <b class="t-sm">Decide</b>
          </div>
          <div class="col popin" style="--i: 9; align-items: center; gap: 8px; position: relative">
            <div class="ico sm" style="background: var(--brand-strong); color: var(--on-brand); box-shadow: var(--shadow-brand)"><Icon icon="ion:trophy-outline" :width="18" :height="18" /></div>
            <b class="t-sm brand-ink">Libertad</b>
          </div>
        </div>
      </div>

      <!-- 2 · Asesorías personalizadas -->
      <div v-else-if="actual === 2" :key="2" class="col" style="gap: 22px">
        <span class="t-over rise">Características destacadas · 1 de 3</span>
        <h2 class="rise" style="--i: 1">Asesorías personalizadas</h2>
        <p class="muted rise" style="--i: 2; font-size: 18px; line-height: 29px">
          Orientación adaptada a <strong style="color: var(--ink)">tus necesidades financieras</strong>.
        </p>
        <div class="card rise" style="--i: 3; padding: 18px; display: flex; flex-direction: column; gap: 12px">
          <div class="row gap-3">
            <div class="avatar" style="width: 34px; height: 34px; font-size: 12px; background: var(--balance-tint); color: var(--balance)">MM</div>
            <div class="grow">
              <b class="t-sm">Tu mentor</b>
              <div class="t-xs muted row gap-1"><i class="punto" style="background: var(--income)"></i>En línea</div>
            </div>
          </div>
          <div class="popin" style="--i: 5; align-self: flex-start; max-width: 85%; padding: 10px 14px; border-radius: 4px 16px 16px 16px; background: var(--surface-2)">
            <span class="t-sm">Vi que este mes gastaste más en comida. ¿Armamos juntos un plan a tu medida?</span>
          </div>
          <div class="popin" style="--i: 8; align-self: flex-end; max-width: 80%; padding: 10px 14px; border-radius: 16px 4px 16px 16px; background: var(--brand-strong); color: var(--on-brand)">
            <span class="t-sm">¡Sí! Quiero ahorrar para un viaje.</span>
          </div>
          <div class="row fadein" style="--i: 11; gap: 4px; padding: 10px 14px; border-radius: 16px; background: var(--surface-2); align-self: flex-start">
            <i class="punto" style="background: var(--ink-subtle); animation: blink 1s steps(1) infinite"></i>
            <i class="punto" style="background: var(--ink-subtle); animation: blink 1s steps(1) 0.33s infinite"></i>
            <i class="punto" style="background: var(--ink-subtle); animation: blink 1s steps(1) 0.66s infinite"></i>
          </div>
        </div>
      </div>

      <!-- 3 · Asesorías grupales -->
      <div v-else-if="actual === 3" :key="3" class="col" style="gap: 22px">
        <span class="t-over rise">Características destacadas · 2 de 3</span>
        <h2 class="rise" style="--i: 1">Asesorías grupales</h2>
        <p class="muted rise" style="--i: 2; font-size: 18px; line-height: 29px">
          Aprende y comparte experiencias en <strong style="color: var(--ink)">sesiones interactivas</strong>.
        </p>
        <div class="card rise" style="--i: 3; padding: 20px">
          <div class="row between">
            <span class="badge expense"><i class="punto live" style="background: var(--expense)"></i>En vivo</span>
            <span class="t-xs muted">Sesión grupal</span>
          </div>
          <h3 class="t-h2" style="margin-top: 12px">Cómo organizar tu primer presupuesto</h3>
          <div class="row" style="margin-top: 16px">
            <div class="row" style="gap: 0">
              <span class="avatar popin" style="--i: 5; width: 36px; height: 36px; font-size: 12px; border: 2px solid var(--surface); background: var(--brand-tint); color: var(--brand-ink)">AL</span>
              <span class="avatar popin" style="--i: 6; width: 36px; height: 36px; font-size: 12px; margin-left: -10px; border: 2px solid var(--surface); background: var(--income-tint); color: var(--income)">JP</span>
              <span class="avatar popin" style="--i: 7; width: 36px; height: 36px; font-size: 12px; margin-left: -10px; border: 2px solid var(--surface); background: var(--balance-tint); color: var(--balance)">SM</span>
              <span class="avatar popin" style="--i: 8; width: 36px; height: 36px; font-size: 12px; margin-left: -10px; border: 2px solid var(--surface); background: var(--info-tint); color: var(--info)">DR</span>
            </div>
            <span class="t-sm muted grow">comparten sus experiencias</span>
          </div>
          <div class="row gap-2" style="margin-top: 16px; flex-wrap: wrap">
            <span class="chip" style="height: 30px">Preguntas en vivo</span>
            <span class="chip" style="height: 30px">Retos en grupo</span>
            <span class="chip" style="height: 30px">Grabación</span>
          </div>
        </div>
      </div>

      <!-- 4 · Gestión moderna -->
      <div v-else :key="4" class="col" style="gap: 22px">
        <span class="t-over rise">Características destacadas · 3 de 3</span>
        <h2 class="rise" style="--i: 1">Gestión moderna</h2>
        <p class="muted rise" style="--i: 2; font-size: 18px; line-height: 29px">
          Teorías económicas actualizadas para <strong style="color: var(--ink)">maximizar tu ahorro e inversión</strong>.
        </p>
        <div class="card rise" style="--i: 3; padding: 20px; display: flex; flex-direction: column; gap: 18px">
          <div class="col gap-2">
            <div class="row between t-sm"><b>Regla 50 / 30 / 20</b><span class="muted">Cómo repartir tu ingreso</span></div>
            <div style="display: flex; gap: 4px; height: 14px; border-radius: 999px; overflow: hidden">
              <i style="width: 50%; background: var(--balance); transform-origin: left; animation: grow-x var(--dur-chart) var(--ease-out) 0.3s both"></i>
              <i style="width: 30%; background: var(--brand); transform-origin: left; animation: grow-x var(--dur-chart) var(--ease-out) 0.5s both"></i>
              <i style="width: 20%; background: var(--income); transform-origin: left; animation: grow-x var(--dur-chart) var(--ease-out) 0.7s both"></i>
            </div>
            <div class="legend">
              <span><i class="punto" style="background: var(--balance)"></i>Necesidades</span>
              <span><i class="punto" style="background: var(--brand)"></i>Gustos</span>
              <span><i class="punto" style="background: var(--income)"></i>Ahorro</span>
            </div>
          </div>
          <div class="divider" style="margin: 0"></div>
          <div class="col gap-1">
            <div class="row between t-sm"><b>Interés compuesto</b><span class="muted">Tu ahorro crece sobre lo que ya ganó</span></div>
            <svg class="chart" viewBox="0 0 400 80" preserveAspectRatio="none" style="height: 80px">
              <path class="line" pathLength="1000" style="--len: 1000; stroke: var(--ink-subtle); stroke-width: 2; stroke-dasharray: 6 6; animation: none" d="M0,72 L400,40"></path>
              <path class="line" pathLength="1000" style="--len: 1000; stroke: var(--income)" d="M0,72 C120,70 220,60 300,40 C340,30 370,18 400,6"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="row between" style="position: relative">
      <div class="row gap-2" role="tablist" aria-label="Información de MonyMonty">
        <button
          v-for="(d, k) in dots"
          :key="k"
          type="button"
          role="tab"
          :aria-label="d.label"
          :aria-selected="d.activo"
          @click="ir(k)"
          :style="{
            height: '8px',
            width: d.activo ? '28px' : '8px',
            border: 0,
            padding: 0,
            borderRadius: '999px',
            background: d.activo ? 'var(--brand)' : 'var(--surface-3)',
            transition: 'width var(--dur-base) var(--ease-in-out), background var(--dur-base)',
          }"
        ></button>
      </div>
      <div class="row gap-2">
        <button type="button" class="btn icon sm" aria-label="Anterior" @click="ir(actual - 1)"><Icon icon="ion:chevron-back-outline" :width="16" :height="16" /></button>
        <button type="button" class="btn icon sm" aria-label="Siguiente" @click="ir(actual + 1)"><Icon icon="ion:chevron-forward-outline" :width="16" :height="16" /></button>
      </div>
    </div>
  </aside>
</template>
