import axios from "axios";

import {useAuthStore} from "../../../stores/autenticacion/authStore";
import {useLoadingStore} from "../../../stores/contexto/loadingStore";
import router from "../../../router/index";

const API_URL = import.meta.env.VITE_API_URL;

export function useAuth() {
  const authStore = useAuthStore();
  const loadingStore = useLoadingStore();

  // Verificar autenticación
  async function checkAuth() {
    loadingStore.start("auth");
    try {
      const response = await axios.get(`${API_URL}auth/check`, {
        withCredentials: true,
      });
      authStore.setAuthenticated(response.data.authenticated);
    } catch (error) {
      authStore.logout();
    } finally {
      loadingStore.stop("auth");
    }
  }

  // Login
  async function login(credentials) {
    loadingStore.start("auth");
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
      loadingStore.stop("auth");
    }
  }

  // CrearUsuario
  async function CrearUsuario(userData) {
    loadingStore.start("auth");
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
      loadingStore.stop("auth");
    }
  }

  // Lanza Correo para recuperacion
  async function recuperarCuenta(email) {
    loadingStore.start("auth");
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
      loadingStore.stop("auth");
    }
  }

  // Validamos token de recuperar Contraseña
  async function verificacionTocken({token}) {
    loadingStore.start("auth");
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
      loadingStore.stop("auth");
    }
  }

  // Cambio de clave
  async function CambiodeClave(credentials) {
    loadingStore.start("auth");
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
      loadingStore.stop("auth");
    }
  }
  // Logout
  async function logout() {
    loadingStore.start("auth");
    try {
      await axios.get(`${API_URL}auth/logout`, {
        withCredentials: true,
      });
      authStore.logout();
      router.push({name: "Login"});
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      loadingStore.stop("auth");
    }
  }

  return {
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
