import {ref} from "vue";
import axios from "axios";

/**
 * Movimientos y cuentas del usuario, compartidos por el tablero, la lista de movimientos,
 * la búsqueda global y los formularios. Endpoints de la API:
 *   POST movimiento/list  (page, limit y filtros: tipo, fechaInicio, fechaFin, cuentas, monedas, categorias)
 *   GET  entidad          (solo _id, value y label)
 */
const API_URL = import.meta.env.VITE_API_URL;
const OPCIONES = {withCredentials: true};

const MAX_PAGINAS = 25; // 25 × 100 = 2.500 movimientos como tope de seguridad

/** Todos los movimientos, del más reciente al más antiguo */
export const movimientos = ref([]);
export const entidades = ref([]);
/** true hasta que termina la primera carga completa */
export const movimientosSinCargar = ref(true);

export async function pedirMovimientos(body) {
  const res = await axios.post(`${API_URL}movimiento/list`, body, OPCIONES);
  return res.data?.data ?? {data: [], total: 0, totalPages: 0};
}

/** Trae todos los movimientos en páginas de 100 */
export async function cargarTodosLosMovimientos() {
  const primera = await pedirMovimientos({page: 1, limit: 100});
  const lista = [...primera.data];

  if (primera.totalPages > 1) {
    const paginas = Math.min(primera.totalPages, MAX_PAGINAS);
    const resto = await Promise.all(Array.from({length: paginas - 1}, (_, i) => pedirMovimientos({page: i + 2, limit: 100})));
    resto.forEach((r) => lista.push(...r.data));
  }
  movimientos.value = lista;
  movimientosSinCargar.value = false;
}

export async function cargarEntidades() {
  const res = await axios.get(`${API_URL}entidad`, OPCIONES);
  entidades.value = res.data?.data ?? [];
}
