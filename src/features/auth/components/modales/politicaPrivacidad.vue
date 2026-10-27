<script setup>
/**
 * Modal de Política de privacidad (S08): primero un resumen en 4 tarjetas y,
 * con "Texto completo", las 8 secciones de la política.
 */
import {ref, watch, nextTick, onBeforeUnmount} from "vue";
import Icono from "@/components/iconos/Icono.vue";

const visible = defineModel({type: Boolean, required: true});

const ACTUALIZADO = "24 de enero de 2026";
// Pendiente de definir por el responsable del tratamiento (igual que en la política anterior)
const CORREO_PRIVACIDAD = "[privacidad@tuapp.com]";

const RESUMEN = [
  {icono: "layers", tono: "balance", titulo: "Qué guardamos", texto: "Tus datos de perfil y lo que registras: movimientos, categorías y presupuesto, además de datos de uso como IP y navegador."},
  {icono: "bulb", tono: "brand", titulo: "Para qué", texto: "Para tu registro e inicio de sesión, mostrarte tu tablero y rankings, mejorar la experiencia y cumplir obligaciones legales."},
  {icono: "people", tono: "info", titulo: "Con quién", texto: "No vendemos tus datos. Solo se comparten si el servicio lo necesita (hosting, analítica) o si lo exige una autoridad."},
  {icono: "download", tono: "income", titulo: "Tus derechos", texto: "Conocer, actualizar, rectificar, revocar y suprimir tus datos, de forma gratuita."},
];

const SECCIONES = [
  {titulo: "1. Responsable del tratamiento", lineas: ["Responsable: [Nombre completo de la empresa o persona natural]", "NIT / CC: [Tu NIT o documento]", "Domicilio: Bucaramanga, Santander, Colombia", `Contacto: ${CORREO_PRIVACIDAD}`]},
  {
    titulo: "2. Datos que recolectamos",
    lineas: [
      "Datos de identificación: nombre, documento de identidad, correo electrónico, número de teléfono.",
      "Datos financieros: información relacionada con movimientos, categorías y presupuesto (estrictamente necesario).",
      "Datos de uso: dirección IP, tipo de dispositivo, navegador, fecha y hora de acceso.",
      "Geolocalización: aproximada, solo si lo autorizas expresamente.",
    ],
  },
  {titulo: "3. Finalidades del tratamiento", lineas: ["Registro y autenticación.", "Gestión de dashboard y rankings.", "Mejora de la experiencia técnica.", "Cumplimiento de obligaciones legales."]},
  {titulo: "4. Derechos (Habeas Data)", lineas: ["Como titular tienes derecho gratuito a conocer, actualizar, rectificar, revocar y suprimir tus datos.", `Para ejercerlos escribe a ${CORREO_PRIVACIDAD}.`]},
  {titulo: "5. Compartición de datos", lineas: ["No vendemos tus datos. Solo los compartimos si:", "Es necesario para el servicio (proveedores de hosting, analítica).", "Lo exige una autoridad competente."]},
  {titulo: "6. Seguridad", lineas: ["Implementamos medidas técnicas y organizativas (cifrado, firewalls) para proteger tus datos contra acceso no autorizado, pérdida o alteración."]},
  {titulo: "7. Cambios a la política", lineas: ["Podemos actualizar esta política. Te notificaremos los cambios importantes en la plataforma o por correo."]},
  {titulo: "8. Contacto", lineas: [`Email: ${CORREO_PRIVACIDAD}`, "Dirección: Bucaramanga, Santander – Colombia"]},
];

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
            <div class="ico income"><Icono i="shield-checkmark" :s="22" /></div>
            <div class="grow">
              <h2 id="privacidad-titulo" class="t-h2">Tu privacidad, en corto</h2>
              <p class="t-sm muted">Lo esencial en 30 segundos. Última actualización: {{ ACTUALIZADO }}.</p>
            </div>
            <button type="button" class="x" aria-label="Cerrar" @click="cerrar"><Icono i="close" :s="20" /></button>
          </div>

          <div class="modal-b" style="overflow: auto">
            <div class="grid g2 resumen" style="gap: 14px">
              <div v-for="r in RESUMEN" :key="r.titulo" class="card flat" style="background: var(--surface-2); border: 0">
                <div class="ico sm" :class="r.tono"><Icono :i="r.icono" :s="18" /></div>
                <h3 class="t-h3" style="margin-top: 12px">{{ r.titulo }}</h3>
                <p class="t-sm muted" style="margin-top: 4px">{{ r.texto }}</p>
              </div>
            </div>

            <div class="banner info">
              <Icono i="information-circle" :s="18" />
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
            <button type="button" class="btn primary" @click="cerrar"><Icono i="checkmark" :s="18" />Entendido</button>
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
