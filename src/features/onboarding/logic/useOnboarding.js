import {reactive} from "vue";
import {userData} from "@/features/dashBoard/logic/user.js";

/**
 * Estado compartido de la configuración inicial.
 * Es un singleton: el registro lo deja con el nombre y cada paso va completándolo.
 */
const estado = reactive({
  nombre: "",
  divisaId: "COP",
  // Cuenta creada en el paso 2 (null mientras no se haya guardado)
  cuenta: null,
  // Claves de las categorías que ya se crearon en la API, para no duplicarlas al reintentar
  categoriasCreadas: [],
  categoriasElegidas: [],
});

export function useOnboarding() {
  function reiniciar() {
    estado.nombre = "";
    estado.divisaId = "COP";
    estado.cuenta = null;
    estado.categoriasCreadas = [];
    estado.categoriasElegidas = [];
  }

  /** Asegura el nombre para el saludo (si se recarga la página se pierde, así que se pide a la API). */
  async function cargarNombre() {
    if (estado.nombre) return;
    const result = await userData().cargarUsuario();
    if (result?.success) estado.nombre = result.data?.nombre ?? "";
  }

  return {estado, reiniciar, cargarNombre};
}
