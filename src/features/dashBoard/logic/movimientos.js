import axios from "axios";
import {useToast} from "primevue/usetoast";
import {useDashboardFilters} from "@/stores/filterStore";

const API_URL = import.meta.env.VITE_API_URL;

export function dataMovimientos() {
  const toast = useToast();

  const filterStore = useDashboardFilters(); // Store access

  const request = async (endpoint, payload = {}) => {
    // Merge params from store
    const bodyIndex = {...filterStore.query, ...payload};

    // lógica aquí
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, bodyIndex, {
        withCredentials: true,
      });
      if (res.status === 200) {
        return {...res};
      }
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || " ",
        life: 4000,
      });
    }
  };
  const Cars = () => request("movimiento/Dashboard");
  const getRankingCategorias = () => request("movimiento/ranking");
  const getAllMovimientos = (page = 1, limit = 10, filters = {}) => {
    const payload = {
      page,
      limit,
    };
    if (filters.tipo) payload.tipo = filters.tipo;
    return request("movimiento/list", payload);
  };

  return {
    Cars,
    getRankingCategorias,
    getAllMovimientos,
  };
}
