// src/composables/useAuth.js
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/auth'

export function useAuth() {
  // Estados reactivos
  const authState = reactive({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  })

  const router = useRouter()

  // Computed properties
  const userName = computed(() => authState.user?.name || 'Invitado')
  const userPlan = computed(() => authState.user?.plan || 'Gratis')
  const userEmail = computed(() => authState.user?.email || '')

  // Métodos
  const checkAuthStatus = () => {
    authState.isAuthenticated = AuthService.isAuthenticated()
    if (authState.isAuthenticated) {
      authState.user = AuthService.getUser()
    }
  }

  const login = async (credentials) => {
    authState.loading = true
    authState.error = null

    try {
      const response = await AuthService.login(credentials)
      
      if (response.token) {
        AuthService.setToken(response.token)
        if (response.user) {
          AuthService.setUser(response.user)
        }
        
        authState.isAuthenticated = true
        authState.user = response.user
        return { success: true }
      }
    } catch (error) {
      authState.error = error.message || 'Error de autenticación'
      return { success: false, error }
    } finally {
      authState.loading = false
    }
  }

  const logout = async () => {
    AuthService.logout()
    authState.isAuthenticated = false
    authState.user = null
    
    // Redirigir al login
    await router.push('/login')
  }

  const updateProfile = (userData) => {
    if (authState.user) {
      authState.user = { ...authState.user, ...userData }
      AuthService.setUser(authState.user)
    }
  }

  // Verificar autenticación al montar
  onMounted(() => {
    checkAuthStatus()
  })

  return {
    // Estados
    authState,
    
    // Computed
    userName,
    userPlan,
    userEmail,
    
    // Métodos
    checkAuthStatus,
    login,
    logout,
    updateProfile
  }
}