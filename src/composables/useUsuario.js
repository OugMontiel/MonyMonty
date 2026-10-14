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
  // El plan llega en minúsculas (free, basic, premium)
  const plan = computed(() => {
    const p = String(usuario.value?.planId ?? "");
    return p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : "";
  });

  return {usuario, nombreCompleto, iniciales, plan, primerNombre: computed(() => usuario.value?.nombre ?? "")};
}
