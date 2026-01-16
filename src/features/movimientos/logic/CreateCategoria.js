import {ref} from "vue";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export function useCategorias() {
  const loading = ref(false);
  const error = ref(null);

  /**
   * Crea una nueva categoría.
   * @param {Object} data - Los datos de la categoría.
   * @returns {Promise<Object>} - La respuesta del servidor.
   */
  async function createCategoria(data) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}categoria/`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error("Error creando categoría:", err);
      error.value = err.response?.data?.message || "Error al crear la categoría";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Crea una nueva subcategoría en una categoría existente.
   * @param {string} categoriaId - ID de la categoría padre.
   * @param {Object} data - Los datos de la subcategoría.
   * @returns {Promise<Object>} - La respuesta del servidor.
   */
  async function createSubcategoria(categoriaId, data) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}categoria/${categoriaId}/subcategoria`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error("Error creando subcategoría:", err);
      error.value = err.response?.data?.message || "Error al crear la subcategoría";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    createCategoria,
    createSubcategoria,
    loading,
    error,
  };
}
