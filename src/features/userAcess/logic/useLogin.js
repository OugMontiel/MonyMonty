import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const isAuthenticated = ref(!!localStorage.getItem('token'))
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem('token')
    isAuthenticated.value = false
    router.push('/login')
  }

  const login = (token) => {
    localStorage.setItem('token', token)
    isAuthenticated.value = true
    router.push('/dashboard')
  }

  return {
    isAuthenticated,
    logout,
    login
  }
}