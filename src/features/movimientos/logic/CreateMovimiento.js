import {ref} from "vue";
import axios from "axios";
import {useGlobalState} from "@/composables/useGlobalState";
import {useLoadingStore} from "@/stores/loadingStore";

const API_URL = import.meta.env.VITE_API_URL;

export function useMovimientos() {
  const loadingStore = useLoadingStore();
  const error = ref(null);
  const {triggerGlobalRefresh} = useGlobalState();

  /**
   * Crea un nuevo movimiento bancario.
   * @param {Object} data - Los datos del movimiento.
   * @returns {Promise<Object>} - La respuesta del servidor.
   */
  async function createMovimiento(data) {
    loadingStore.createMovimiento = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}movimiento/`, data, {
        withCredentials: true,
      });
      triggerGlobalRefresh();
      return response.data;
    } catch (err) {
      console.error("Error creando movimiento:", err);
      error.value = err.response?.data?.message || "Error al crear el movimiento";
      throw err;
    } finally {
      loadingStore.createMovimiento = false;
    }
  }

  /**
   * Actualiza un movimiento existente.
   * @param {string} id - El ID del movimiento.
   * @param {Object} data - Los nuevos datos del movimiento.
   */
  async function updateMovimiento(id, data) {
    loadingStore.createMovimiento = true;
    error.value = null;
    try {
      const response = await axios.put(`${API_URL}movimiento/${id}`, data, {
        withCredentials: true,
      });
      triggerGlobalRefresh();
      return response.data;
    } catch (err) {
      console.error("Error actualizando movimiento:", err);
      error.value = err.response?.data?.message || "Error al actualizar el movimiento";
      throw err;
    } finally {
      loadingStore.createMovimiento = false;
    }
  }

  /**
   * Elimina un movimiento.
   * @param {string} id - El ID del movimiento.
   */
  async function deleteMovimiento(id) {
    loadingStore.createMovimiento = true;
    error.value = null;
    try {
      const response = await axios.delete(`${API_URL}movimiento/${id}`, {
        withCredentials: true,
      });
      triggerGlobalRefresh();
      return response.data;
    } catch (err) {
      console.error("Error eliminando movimiento:", err);
      error.value = err.response?.data?.message || "Error al eliminar el movimiento";
      throw err;
    } finally {
      loadingStore.createMovimiento = false;
    }
  }

  /**
   * Obtiene un movimiento por su ID.
   * @param {string} id - El ID del movimiento.
   * @returns {Promise<Object>} - Los datos del movimiento.
   */
  async function getMovimiento(id) {
    loadingStore.createMovimiento = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_URL}movimiento/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error("Error obteniendo movimiento:", err);
      error.value = err.response?.data?.message || "Error al obtener el movimiento";
      throw err;
    } finally {
      loadingStore.createMovimiento = false;
    }
  }

  return {
    getMovimiento,
    createMovimiento,
    updateMovimiento,
    deleteMovimiento,
    error,
  };
}
