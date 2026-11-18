<script setup>
/**
 * Modal de Política de privacidad (S08): primero un resumen en 4 tarjetas y,
 * con "Texto completo", las 8 secciones de la política.
 */
import {ref, watch, nextTick, onBeforeUnmount} from "vue";
import {Icon} from "@iconify/vue";
import {ACTUALIZADO, RESUMEN_PRIVACIDAD as RESUMEN, SECCIONES_PRIVACIDAD as SECCIONES} from "../../views/Const.js";

const visible = defineModel({type: Boolean, required: true});

const modal = ref(null);
const textoCompleto = ref(false);

function cerrar() {
  visible.value = false;
}

function alTeclear(e) {
  if (e.key === "Escape") cerrar();
}

watch(visible, async (abierto) => {
  document.body.style.overflow = abierto ? "hidden" : "";
  if (!abierto) return;
  textoCompleto.value = false;
  await nextTick();
  modal.value?.focus();
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="tema" data-theme="light">
      <div class="overlay" @click.self="cerrar" @keydown="alTeclear">
        <div
          ref="modal"
          class="modal wide"
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacidad-titulo"
          tabindex="-1"
          style="max-height: calc(100vh - 32px); outline: 0"
        >
          <div class="modal-h">
            <div class="ico income"><Icon icon="ion:shield-checkmark-outline" :width="22" :height="22" /></div>
            <div class="grow">
              <h2 id="privacidad-titulo" class="t-h2">Tu privacidad, en corto</h2>
              <p class="t-sm muted">Lo esencial en 30 segundos. Última actualización: {{ ACTUALIZADO }}.</p>
            </div>
            <button type="button" class="x" aria-label="Cerrar" @click="cerrar"><Icon icon="ion:close-outline" :width="20" :height="20" /></button>
          </div>

          <div class="modal-b" style="overflow: auto">
            <div class="grid g2 resumen" style="gap: 14px">
              <div v-for="r in RESUMEN" :key="r.titulo" class="card flat" style="background: var(--surface-2); border: 0">
                <div class="ico sm" :class="r.tono"><Icon :icon="r.icono" :width="18" :height="18" /></div>
                <h3 class="t-h3" style="margin-top: 12px">{{ r.titulo }}</h3>
                <p class="t-sm muted" style="margin-top: 4px">{{ r.texto }}</p>
              </div>
            </div>

            <div class="banner info">
              <Icon icon="ion:information-circle-outline" :width="18" :height="18" />
              <span class="grow">Tratamiento de datos conforme a la Ley 1581 de 2012 (Colombia).</span>
              <a href="#" class="t-sm" :aria-expanded="textoCompleto" @click.prevent="textoCompleto = !textoCompleto">
                {{ textoCompleto ? "Ocultar texto" : "Texto completo" }}
              </a>
            </div>

            <div v-if="textoCompleto" class="col gap-4 rise" style="gap: 18px">
              <section v-for="s in SECCIONES" :key="s.titulo" class="col gap-2">
                <h3 class="t-h3">{{ s.titulo }}</h3>
                <p v-for="(l, k) in s.lineas" :key="k" class="t-sm muted">{{ l }}</p>
              </section>
            </div>
          </div>

          <div class="modal-f">
            <button type="button" class="btn primary" @click="cerrar"><Icon icon="ion:checkmark-outline" :width="18" :height="18" />Entendido</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@media (max-width: 720px) {
  .resumen {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
