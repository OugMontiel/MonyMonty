import axios from "axios";
import {useToast} from "primevue/usetoast";

const API_URL = import.meta.env.VITE_API_URL;

export function dataMovimientos() {
  const toast = useToast();
  
  const request = async (endpoint) => {
    // lógica aquí
    try { 
      const { data } = await axios.get(`${API_URL}${endpoint}`, {
        withCredentials: true,
      });

      return data; 
    } catch(error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || " ",
        life: 4000,
      });
    }
  };
  const Cars = () => request("")
  

  return {
    Cars
  };
}
