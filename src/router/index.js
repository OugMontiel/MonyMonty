import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import NewMov from '../views/NewMov.vue'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'vista incial', 
      component: Home,
    },
    {
      path: '/Dashboard',
      name: 'vista para todo el tablero ',
      component: Dashboard,
    },
    {
      path: '/NewMov',
      name: 'Vista para nuevos movimiento',
      component: NewMov,
    },
  ],
})

export default router
