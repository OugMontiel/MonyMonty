import { ref, computed } from 'vue'
import axios from 'axios'

const isAuthenticated = ref(false)
const loading = ref(false)

export function useAuth() {
  
  // Verificar autenticación
  async function checkAuth() {
    loading.value = true
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/check`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.status === 200) {
        isAuthenticated.value = true
        return true
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      isAuthenticated.value = false
    } finally {
      loading.value = false
    }
    return false
  }

  

  return {
    // Estado
    isAuthenticated: computed(() => isAuthenticated.value),
    loading: computed(() => loading.value),
    
    // Métodos
    checkAuth,
  }
}