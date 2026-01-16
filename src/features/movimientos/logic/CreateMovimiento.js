import { ref } from "vue";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export function useMovimientos() {
  const loading = ref(false);
  const error = ref(null);

  /**
   * Crea un nuevo movimiento bancario.
   * @param {Object} data - Los datos del movimiento.
   * @returns {Promise<Object>} - La respuesta del servidor.
   */
  async function createMovimiento(data) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}movimiento/`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error("Error creando movimiento:", err);
      error.value = err.response?.data?.message || "Error al crear el movimiento";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Actualiza un movimiento existente.
   * @param {string} id - El ID del movimiento.
   * @param {Object} data - Los nuevos datos del movimiento.
   */
  async function updateMovimiento(id, data) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`${API_URL}movimiento/${id}`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error("Error actualizando movimiento:", err);
      error.value = err.response?.data?.message || "Error al actualizar el movimiento";
      throw err;
    } finally {
      loading.value = false;
    }
  }

   /**
   * Elimina un movimiento.
   * @param {string} id - El ID del movimiento.
   */
  async function deleteMovimiento(id) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.delete(`${API_URL}movimiento/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error("Error eliminando movimiento:", err);
      error.value = err.response?.data?.message || "Error al eliminar el movimiento";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    createMovimiento,
    updateMovimiento,
    deleteMovimiento,
    loading,
    error,
  };
}
