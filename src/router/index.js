import { createRouter, createWebHistory } from 'vue-router'
import dashboard from '../views/dashboard.vue'
import NewMov from '../views/NewMov.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'vista para todo el tablero ',
      component: dashboard,
    },
    {
      path: '/NewMov',
      name: 'Vista para nuevos movimiento',
      component: NewMov,
    },
  ],
})

export default router
