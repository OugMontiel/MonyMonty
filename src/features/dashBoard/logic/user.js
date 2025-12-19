import axios from "axios";
import { ref } from "vue";

const API_URL = import.meta.env.VITE_API_URL;

// Estado compartido global para el usuario
const cachedUser = ref(null);
const isUserLoaded = ref(false);

export function userData() {
  async function cargarUsuario() {
    try {
      const res = await axios.get(`${API_URL}user/me`, {withCredentials: true});
      if (res.status === 200) {
        // Guardar en caché
        cachedUser.value = res.data;
        isUserLoaded.value = true;
        return {success: true, data: res.data};
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error en Cargar el Usuario",
      };
    }
  }
  return {
    cargarUsuario,
    usuario: cachedUser,
  };
}
