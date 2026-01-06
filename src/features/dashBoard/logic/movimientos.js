import axios from "axios";
import {useToast} from "primevue/usetoast";

const API_URL = import.meta.env.VITE_API_URL;

export function dataMovimientos() {
  const toast = useToast();

  const request = async (endpoint) => {
    // lógica aquí
    try {
      const res = await axios.get(`${API_URL}${endpoint}`, {
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
  const getAllMovimientos = () => request("movimiento/");

  return {
    Cars,
    getAllMovimientos,
  };
}
