import {computed} from "vue";

import {userData} from "@/features/dashBoard/logic/user.js";

/**
 * Datos del usuario autenticado para el layout (nombre, iniciales y plan).
 * `cargarUsuario()` llena un caché compartido; aquí solo se dispara una vez.
 */
const {cargarUsuario, usuario} = userData();
let pedido = false;

export function useUsuario() {
  if (!pedido && !usuario.value) {
    pedido = true;
    cargarUsuario();
  }

  const nombreCompleto = computed(() => `${usuario.value?.nombre ?? ""} ${usuario.value?.apellido ?? ""}`.trim());
  const iniciales = computed(() => {
    const n = usuario.value?.nombre?.[0] ?? "";
    const a = usuario.value?.apellido?.[0] ?? "";
    return (n + a).toUpperCase() || "MM";
  });
  // El plan llega en minúsculas (free, basic, premium). En pantalla "premium" se llama Pro.
  const planId = computed(() => String(usuario.value?.planId ?? "").toLowerCase());
  const plan = computed(() => ({free: "Free", basic: "Basic", premium: "Pro"})[planId.value] ?? "");

  return {usuario, nombreCompleto, iniciales, plan, planId, primerNombre: computed(() => usuario.value?.nombre ?? "")};
}
