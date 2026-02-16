import {ref} from "vue";
import axios from "axios";
import {useGlobalState} from "@/composables/useGlobalState";
import {useLoadingStore} from "@/stores/loadingStore";

const API_URL = import.meta.env.VITE_API_URL;

export function useCategorias() {
  const loadingStore = useLoadingStore();
  const error = ref(null);
  const {triggerGlobalRefresh} = useGlobalState();

  /**
   * Crea una nueva categoría.
   * @param {Object} data - Los datos de la categoría.
   * @returns {Promise<Object>} - La respuesta del servidor.
   */
  async function createCategoria(data) {
    loadingStore.start("createCategoria");
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}categoria/`, data, {
        withCredentials: true,
      });
      triggerGlobalRefresh();
      return response.data;
    } catch (err) {
      console.error("Error creando categoría:", err);
      error.value = err.response?.data?.message || "Error al crear la categoría";
      throw err;
    } finally {
      loadingStore.stop("createCategoria");
    }
  }

  /**
   * Crea una nueva subcategoría en una categoría existente.
   * @param {string} categoriaId - ID de la categoría padre.
   * @param {Object} data - Los datos de la subcategoría.
   * @returns {Promise<Object>} - La respuesta del servidor.
   */
  async function createSubcategoria(categoriaId, data) {
    loadingStore.start("createCategoria");
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}categoria/${categoriaId}/subcategoria`, data, {
        withCredentials: true,
      });
      triggerGlobalRefresh();
      return response.data;
    } catch (err) {
      console.error("Error creando subcategoría:", err);
      error.value = err.response?.data?.message || "Error al crear la subcategoría";
      throw err;
    } finally {
      loadingStore.stop("createCategoria");
    }
  }

  return {
    createCategoria,
    createSubcategoria,
    error,
  };
}
