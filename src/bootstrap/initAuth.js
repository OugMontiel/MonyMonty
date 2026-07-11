import { useAuth } from '../features/auth/logic/useAuth'

export async function initAuth() {
  const { checkAuth } = useAuth()
  await checkAuth()
}
