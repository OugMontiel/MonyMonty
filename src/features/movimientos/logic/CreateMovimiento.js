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

  return {
    createMovimiento,
    loading,
    error,
  };
}
