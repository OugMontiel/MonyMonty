import axios from "axios"
import { ref } from "vue"

const user = ref(null)

async function cargarUsuario() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    user.value = res.data
  } catch (error) {
    console.error("Error al cargar usuario:", error)
    user.value = null
  }
}

export { user, cargarUsuario }
