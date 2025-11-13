import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export function userData() {
  async function cargarUsuario() {
    try {
      const res = await axios.get(`${API_URL}user/me`, {withCredentials: true});
      if (res.status === 200) {
        return {success: true, ...res};
      }
    } catch (error) {
      return {
        success: false,
        error: error.res?.data?.message || "Error en Cargar el Usuario",
      };
    }
  }
  // Logout
  async function logout() {
    try {
      await axios.get(`${API_URL}auth/logout`, {withCredentials: true});
    } catch (error) {
      return {
        success: false,
        error: error.res?.data?.message || "Error en Cargar el Usuario",
      };
    }
  }

  return {
    cargarUsuario,
    logout,
  };
}
