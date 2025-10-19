import {ref, computed} from "vue";
import axios from "axios";

const isAuthenticated = ref(false);
const loading = ref(false);

export function useAuth() {
  // Debug: verificar variable de entorno
  const API_URL = import.meta.env.VITE_API_URL;

  // Verificar autenticación
  async function checkAuth() {
    loading.value = true;
    try {
      const response = await axios.get(`${API_URL}auth/check`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        isAuthenticated.value = true;
        return true;
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      isAuthenticated.value = false;
    } finally {
      loading.value = false;
    }
    return false;
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
        return {success: true};
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

  // Logout
  async function logout() {
    loading.value = true;
    try {
      await axios.post(
        `${API_URL}auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      isAuthenticated.value = false;
      loading.value = false;
    }
  }

  return {
    // Estado
    isAuthenticated: computed(() => isAuthenticated.value),
    loading: computed(() => loading.value),

    // Métodos
    checkAuth,
    login,
    logout,
  };
}
