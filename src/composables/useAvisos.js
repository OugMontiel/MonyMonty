import {ref} from "vue";

/**
 * Avisos temporales (toasts) con el estilo del diseño: un título, un detalle y, si se quiere, una
 * acción como "Deshacer". Se muestran en MmAvisos, montado en el layout principal.
 */
const avisos = ref([]);
let siguiente = 0;

const DURACION_MS = 5000;

export function useAvisos() {
  /**
   * @param {{tono?: "income"|"expense"|"warning"|"info", icono?: string, titulo: string, detalle?: string,
   *          accion?: {texto: string, ejecutar: Function}, duracion?: number}} aviso
   */
  function mostrar(aviso) {
    const id = ++siguiente;
    const duracion = aviso.duracion ?? DURACION_MS;
    avisos.value.push({id, tono: "income", icono: "checkmark-circle", detalle: "", ...aviso, duracion});
    setTimeout(() => cerrar(id), duracion);
    return id;
  }

  function cerrar(id) {
    avisos.value = avisos.value.filter((a) => a.id !== id);
  }

  return {avisos, mostrar, cerrar};
}
