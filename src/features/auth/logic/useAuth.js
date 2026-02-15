import axios from "axios";

import {useAuthStore} from "../../../stores/autenticacion/authStore";
import {useLoadingStore} from "../../../stores/loadingStore";

const API_URL = import.meta.env.VITE_API_URL;

export function useAuth() {
  const authStore = useAuthStore();
  const loadingStore = useLoadingStore();

  // Verificar autenticación
  async function checkAuth() {
    loadingStore.auth = true;
    try {
      const response = await axios.get(`${API_URL}auth/check`, {
        withCredentials: true,
      });
      authStore.setAuthenticated(response.data.authenticated);
    } catch (error) {
      authStore.logout();
    } finally {
      loadingStore.auth = false;
    }
  }

  // Login
  async function login(credentials) {
    loadingStore.auth = true;
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
      loadingStore.auth = false;
    }
  }

  // CrearUsuario
  async function CrearUsuario(userData) {
    loadingStore.auth = true;
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
      loadingStore.auth = false;
    }
  }

  // Lanza Correo para recuperacion
  async function recuperarCuenta(email) {
    loadingStore.auth = true;
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
      loadingStore.auth = false;
    }
  }

  // Validamos token de recuperar Contraseña
  async function verificacionTocken({token}) {
    loadingStore.auth = true;
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
      loadingStore.auth = false;
    }
  }

  // Cambio de clave
  async function CambiodeClave(credentials) {
    loadingStore.auth = true;
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
      loadingStore.auth = false;
    }
  }
  // Logout
  async function logout() {
    loadingStore.auth = true;
    try {
      await axios.get(`${API_URL}auth/logout`, {
        withCredentials: true,
      });
<<<<<<< HEAD
      authStore.logout();
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      loadingStore.auth = false;
=======
      authStore.logout()
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      loading.value = false;
>>>>>>> 4a7319cc7dc6af0ab01053e48fc11ec4242d8a54
    }
  }

  return {
<<<<<<< HEAD
=======
    // Estado
    loading: computed(() => loading.value),

>>>>>>> 4a7319cc7dc6af0ab01053e48fc11ec4242d8a54
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
