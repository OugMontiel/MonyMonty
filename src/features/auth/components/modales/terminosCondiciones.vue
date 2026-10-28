<script setup>
/**
 * Modal de Términos y condiciones (S07).
 * Índice lateral, progreso de lectura y, si `conAceptar` está activo, un botón
 * "Acepto" que solo se habilita al llegar al final del texto.
 */
import {ref, computed, watch, nextTick, onBeforeUnmount} from "vue";
import Icono from "@/components/iconos/Icono.vue";

const visible = defineModel({type: Boolean, required: true});
defineProps({
  // Muestra "Ahora no" / "Acepto" (registro). Sin esto solo hay "Cerrar" (pie de página)
  conAceptar: {type: Boolean, default: false},
});
const emit = defineEmits(["aceptar"]);

const ACTUALIZADO = "24 de enero de 2026";

// El texto completo de cada sección se agrega donde está el marcador
const SECCIONES = [
  {
    id: "t1",
    titulo: "1. Qué es MonyMonty",
    resumen: "Una plataforma para registrar, entender y planear tu dinero personal. No es un banco ni mueve tu dinero real.",
  },
  {id: "t2", titulo: "2. Tu cuenta", resumen: "Eres responsable de mantener tu contraseña en privado y de la información que registras."},
  {
    id: "t3",
    titulo: "3. Uso aceptable",
    resumen: "Usa MonyMonty solo para tus finanzas o las de tu hogar, sin intentar afectar el servicio.",
  },
  {
    id: "t4",
    titulo: "4. Planes y pagos",
    resumen: "El plan Free no tiene costo. Basic y Premium se cobran por periodo y puedes cancelarlos cuando quieras.",
  },
  {id: "t5", titulo: "5. Asesoría", resumen: "Los consejos y mentorías son educativos; las decisiones finales sobre tu dinero son tuyas."},
  {
    id: "t6",
    titulo: "6. Responsabilidad",
    resumen: "Trabajamos para que el servicio esté disponible y seguro, sin garantizar que no tenga interrupciones.",
  },
  {
    id: "t7",
    titulo: "7. Cambios",
    resumen: "Podemos actualizar estos términos y te avisaremos de los cambios importantes dentro de la plataforma.",
  },
];

const cuerpo = ref(null);
const modal = ref(null);
const progreso = ref(0);
const seccionActiva = ref(SECCIONES[0].id);

const leidoCompleto = computed(() => progreso.value >= 98);

function actualizarProgreso() {
  const el = cuerpo.value;
  if (!el) return;

  const recorrido = el.scrollHeight - el.clientHeight;
  // Si todo cabe sin scroll, ya se leyó completo
  progreso.value = recorrido <= 0 ? 100 : Math.min(100, Math.round((el.scrollTop / recorrido) * 100));

  // La sección activa es la última cuyo inicio ya pasó la parte alta de la vista
  let activa = SECCIONES[0].id;
  for (const s of SECCIONES) {
    const nodo = el.querySelector(`#${s.id}`);
    if (nodo && nodo.offsetTop - el.offsetTop <= el.scrollTop + 40) activa = s.id;
  }
  seccionActiva.value = activa;
}

function irASeccion(id) {
  const el = cuerpo.value;
  const nodo = el?.querySelector(`#${id}`);
  if (nodo) el.scrollTo({top: nodo.offsetTop - el.offsetTop, behavior: "smooth"});
}

function cerrar() {
  visible.value = false;
}

function aceptar() {
  emit("aceptar");
  cerrar();
}

function alTeclear(e) {
  if (e.key === "Escape") cerrar();
}

// Al abrir: foco en el modal, sin scroll de fondo y progreso calculado
watch(visible, async (abierto) => {
  document.body.style.overflow = abierto ? "hidden" : "";
  if (!abierto) return;
  progreso.value = 0;
  await nextTick();
  modal.value?.focus();
  actualizarProgreso();
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
          aria-labelledby="terminos-titulo"
          tabindex="-1"
          style="width: min(880px, 100%); max-height: min(780px, 100vh - 32px); outline: 0"
        >
          <div class="modal-h" style="border-bottom: 1px solid var(--line); padding-bottom: 18px">
            <div class="ico brand"><Icono i="document-text" :s="22" /></div>
            <div class="grow">
              <h2 id="terminos-titulo" class="t-h2">Términos y condiciones</h2>
              <p class="t-sm muted">Última actualización: {{ ACTUALIZADO }}</p>
            </div>
            <button type="button" class="x" aria-label="Cerrar" @click="cerrar"><Icono i="close" :s="20" /></button>
          </div>
          <div
            class="progress sm"
            style="border-radius: 0; height: 3px"
            role="progressbar"
            aria-label="Avance de lectura"
            :aria-valuenow="progreso"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <i :style="{'--w': `${progreso}%`}"></i>
          </div>

          <div class="legal-grid">
            <nav class="legal-nav" aria-label="Índice">
              <div class="t-over" style="padding: 0 12px 8px">Contenido</div>
              <button
                v-for="s in SECCIONES"
                :key="s.id"
                type="button"
                class="menu-item"
                :class="{'is-on': seccionActiva === s.id}"
                :style="seccionActiva === s.id ? {color: 'var(--brand-ink)'} : {color: 'var(--ink-muted)'}"
                @click="irASeccion(s.id)"
              >
                <Icono v-if="seccionActiva === s.id" i="chevron-forward" :s="16" />{{ s.titulo }}
              </button>
            </nav>

            <div ref="cuerpo" class="legal-body" @scroll.passive="actualizarProgreso">
              <section v-for="s in SECCIONES" :id="s.id" :key="s.id" class="col gap-2" :class="{'legal-activa': seccionActiva === s.id}">
                <h3 class="t-h3">{{ s.titulo }}</h3>
                <p class="muted">{{ s.resumen }}</p>
                <p class="t-sm muted">[TEXTO LEGAL COMPLETO DE LA SECCIÓN {{ s.id.slice(1) }}]</p>
              </section>
            </div>
          </div>

          <div class="modal-f" style="align-items: center; margin-top: 0">
            <template v-if="conAceptar">
              <span class="t-xs muted grow row gap-1">
                <Icono :i="leidoCompleto ? 'checkmark-circle' : 'arrow-down'" :s="14" />
                {{ leidoCompleto ? "Listo, ya puedes aceptar" : `Sigue bajando para activar “Acepto” · ${progreso} % leído` }}
              </span>
              <button type="button" class="btn ghost" @click="cerrar">Ahora no</button>
              <button type="button" class="btn primary" :disabled="!leidoCompleto" @click="aceptar">
                <Icono i="checkmark" :s="18" />Acepto
              </button>
            </template>
            <template v-else>
              <span class="grow"></span>
              <button type="button" class="btn primary" @click="cerrar">Cerrar</button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.legal-grid {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  min-height: 0;
  flex: 1;
}
.legal-nav {
  padding: 20px 16px;
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: auto;
}
.legal-nav .menu-item {
  border: 0;
  background: none;
  text-align: left;
  width: 100%;
}
.legal-body {
  position: relative;
  padding: 20px 28px;
  overflow: auto;
  max-height: 520px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.legal-body section {
  padding: 0;
  transition:
    background var(--dur-base),
    padding var(--dur-base);
}
/* La sección que se está leyendo se resalta con un fondo suave */
.legal-body section.legal-activa {
  padding: 16px;
  margin: 0 -16px;
  border-radius: 14px;
  background: var(--brand-tint);
}

@media (max-width: 720px) {
  .legal-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .legal-nav {
    display: none;
  }
  .legal-body {
    padding: 16px 20px;
  }
}
</style>
