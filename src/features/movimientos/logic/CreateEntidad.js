import {ref} from "vue";
import axios from "axios";
import {useGlobalState} from "@/composables/useGlobalState";

const API_URL = import.meta.env.VITE_API_URL;

export function useEntidades() {
  const loading = ref(false);
  const error = ref(null);
  const {triggerGlobalRefresh} = useGlobalState();

  /**
   * Crea una nueva entidad financiera.
   * @param {Object} data - Los datos de la entidad.
   * @returns {Promise<Object>} - La respuesta del servidor.
   */
  async function createEntidad(data) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}entidad/`, data, {
        withCredentials: true,
      });
      triggerGlobalRefresh();
      return response.data;
    } catch (err) {
      console.error("Error creando entidad:", err);
      error.value = err.response?.data?.message || "Error al crear la entidad";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    createEntidad,
    loading,
    error,
  };
}
