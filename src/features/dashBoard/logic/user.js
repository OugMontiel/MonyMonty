import axios from "axios";
import {ref} from "vue";

const user = ref(null);

async function cargarUsuario() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    const res = await axios.get(`${import.meta.env.VITE_API_URL}user/me`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    user.value = res.data;
  } catch (error) {
    console.error("Error al cargar usuario:", error);
    user.value = null;
  }
}

export {user, cargarUsuario};
