import {ref} from "vue";

/**
 * Estado de interfaz compartido por el layout autenticado: la barra superior, el botón
 * flotante y la barra inferior móvil abren los mismos paneles y modales, que se montan
 * una sola vez en el layout (elTablero.vue).
 */
const modalMovimiento = ref(false);
const modalCuenta = ref(false);
const modalCategoria = ref(false);
// Movimiento abierto en el modal existente: {id, modo: "VIEW" | "EDIT" | "DELETE"} (null = creando uno nuevo)
const movimientoAbierto = ref(null);

const busquedaAbierta = ref(false);
const notificacionesAbiertas = ref(false);
const accionesRapidasAbiertas = ref(false);

const sidebarColapsada = ref(false);
try {
  sidebarColapsada.value = localStorage.getItem("mm-sidebar-colapsada") === "1";
} catch {
  // Sin acceso a localStorage (modo privado): se parte expandida
}

export function useAppUi() {
  function nuevoMovimiento() {
    movimientoAbierto.value = null;
    accionesRapidasAbiertas.value = false;
    modalMovimiento.value = true;
  }

  function abrirMovimiento(id, modo = "VIEW") {
    movimientoAbierto.value = {id, modo};
    modalMovimiento.value = true;
  }

  function nuevaCuenta() {
    accionesRapidasAbiertas.value = false;
    modalCuenta.value = true;
  }

  function nuevaCategoria() {
    accionesRapidasAbiertas.value = false;
    modalCategoria.value = true;
  }

  function alternarSidebar() {
    sidebarColapsada.value = !sidebarColapsada.value;
    try {
      localStorage.setItem("mm-sidebar-colapsada", sidebarColapsada.value ? "1" : "0");
    } catch {
      // La preferencia solo dura la sesión
    }
  }

  return {
    modalMovimiento,
    modalCuenta,
    modalCategoria,
    movimientoAbierto,
    busquedaAbierta,
    notificacionesAbiertas,
    accionesRapidasAbiertas,
    sidebarColapsada,
    nuevoMovimiento,
    abrirMovimiento,
    nuevaCuenta,
    nuevaCategoria,
    alternarSidebar,
  };
}
