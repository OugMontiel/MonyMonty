import axios from "axios";
import {useDashboardFilters} from "@/stores/contexto/filterStore";

const API_URL = import.meta.env.VITE_API_URL;

export function dataMovimientos() {
  const filterStore = useDashboardFilters();

  const request = async (endpoint, payload = {}) => {
    // Merge params from store
    const body = {...filterStore.query, ...payload};

    // lógica aquí
    const res = await axios.post(`${API_URL}${endpoint}`, body, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return {...res};
    }
  };
  const Cars = () => request("movimiento/Dashboard");
  const rankingCategorias = () => request("movimiento/ranking");
  const getAllMovimientos = (page = 1, limit = 10, filters = {}) => {
    const payload = {page, limit};
    if (filters.tipo) payload.tipo = filters.tipo;
    return request("movimiento/list", payload);
  };

  return {
    Cars,
    rankingCategorias,
    getAllMovimientos,
  };
}
