import {ref, computed} from "vue";
import axios from "axios";

import { useAuthStore } from '../../../stores/autenticacion/authStore'

const loading = ref(false);
const API_URL = import.meta.env.VITE_API_URL;

export function useAuth() {
  const authStore = useAuthStore()

  // Verificar autenticación
  async function checkAuth() {
    loading.value = true;
    try {
      const response = await axios.get(`${API_URL}auth/check`, {
        withCredentials: true,
      });
      authStore.setAuthenticated(response.data.authenticated);
    } catch (error) {
      authStore.logout();
    } finally {
      loading.value = false;
    }
  }

  // Login
  async function login(credentials) {
    loading.value = true;
    try {
      const response = await axios.post(`${API_URL}auth/login`, credentials, {
        withCredentials: true,
      });

      if (response.status === 201) {
        await checkAuth(); // Revalidar después del login
        return {success: true, ...response};
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error en el login",
      };
    } finally {
      loading.value = false;
    }
  }

  // CrearUsuario
  async function CrearUsuario(userData) {
    loading.value = true;
    try {
      const response = await axios.post(`${API_URL}user`, userData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        return {success: true, ...response};
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error en la creación de usuario",
      };
    } finally {
      loading.value = false;
    }
  }

  // Lanza Correo para recuperacion
  async function recuperarCuenta(email) {
    loading.value = true;
    try {
      const response = await axios.post(`${API_URL}auth/recuperar`, email, {
        withCredentials: true,
      });

      if (response.status === 200) {
        return {success: true, ...response};
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro al enviar correo",
      };
    } finally {
      loading.value = false;
    }
  }

  // Validamos token de recuperar Contraseña
  async function verificacionTocken({token}) {
    loading.value = true;
    try {
      const response = await axios.get(`${API_URL}auth/checkToken?token=${token}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        return {success: true, ...response};
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erro al verificar el token ",
      };
    } finally {
      loading.value = false;
    }
  }

  // Cambio de clave
  async function CambiodeClave(credentials) {
    loading.value = true;
    try {
      const response = await axios.post(`${API_URL}auth/updatePassword`, credentials, {
        withCredentials: true,
      });

      if (response.status === 200) {
        return {success: true, ...response};
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error en actualizar contraseña",
      };
    } finally {
      loading.value = false;
    }
  }
  // Logout
  async function logout() {
    loading.value = true;
    try {
      await axios.get(`${API_URL}auth/logout`, {
        withCredentials: true,
      });
      authStore.logout()
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      loading.value = false;
    }
  }

  return {
    // Estado
    loading: computed(() => loading.value),

    // Métodos
    checkAuth,
    login,
    CrearUsuario,
    recuperarCuenta,
    verificacionTocken,
    CambiodeClave,
    logout,
  };
}
