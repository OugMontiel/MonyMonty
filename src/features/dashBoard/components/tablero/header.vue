<script setup>
import { onMounted, ref, computed, watch } from "vue"
import { user, cargarUsuario } from "@/features/dashBoard/logic/user.js";

// Estados reactivos para mejor control
const isLoading = ref(false)
const error = ref(null)

// Computed para verificar si tenemos datos del usuario
const hasUserData = computed(() => {
  return user.value && Object.keys(user.value).length > 0
})

const carga = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    await cargarUsuario()
    
  } catch (err) {
    error.value = err.message || 'Error desconocido al cargar usuario'
    console.error('❌ Error al cargar usuario:', {
      error: err, // Evitar imprimir el objeto por Seguridad
      message: err.message, // Evitar imprimir el objeto por Seguridad
      stack: err.stack, // Evitar imprimir el objeto por Seguridad
      timestamp: new Date().toLocaleString()
    })
  } finally {
    isLoading.value = false
  }
}

const getBadgeSeverity = (plan) => {
  if (!plan) return 'secondary'
  
  const planLower = plan.toLowerCase()
  if (planLower.includes('premium') || planLower.includes('pro')) return 'success'
  if (planLower.includes('básico') || planLower.includes('free')) return 'info'
  if (planLower.includes('empresarial')) return 'warning'
  return 'secondary'
}

// Watcher para monitorear cambios en el usuario
watch(user, (newUser, oldUser) => {
  console.log('👀 Usuario cambió:', {
    anterior: oldUser,
    nuevo: newUser,
    timestamp: new Date().toLocaleString()
  })
}, { deep: true })

const debugUserInfo = () => {
  console.group('🔍 Información de Debug del Usuario')
  console.log('Valor actual de user:', user.value)
  console.log('Tipo de user:', typeof user.value)
  console.log('Es array?:', Array.isArray(user.value))
  console.log('Es null?:', user.value === null)
  console.log('Es undefined?:', user.value === undefined)
  console.log('Tiene datos?:', hasUserData.value)
  
  if (user.value && typeof user.value === 'object') {
    console.log('Propiedades del usuario:', Object.keys(user.value))
    console.log('Valores del usuario:', Object.values(user.value))
    console.table(user.value)
  }
  
  console.log('Estados del componente:', {
    isLoading: isLoading.value,
    error: error.value,
    hasUserData: hasUserData.value
  })
  console.groupEnd()
}

onMounted(async () => {
  console.log('🏗️ Componente montado, iniciando carga de usuario...')
  
  await carga()
  
  debugUserInfo()
  
})
</script>

<template>
  <header class="flex justify-between items-center px-4 py-2 min-h-[70px] sm:px-5 lg:px-6 xl:px-8">
    <div class="flex-1">
      <!-- <h1>Mony monty</h1> -->
    </div>
    
    <div class="flex-1 text-center">
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-800">Centro</h1>
    </div>
    
    <div class="flex-1 flex justify-end items-center">
      <!-- Loading state con PrimeVue ProgressSpinner -->
      <div v-if="isLoading" class="flex items-center gap-3 text-gray-500">
        <ProgressSpinner size="30px" stroke-width="4" />
        <span class="text-sm hidden md:inline">Cargando usuario...</span>
      </div>

      <!-- Error state con PrimeVue Message -->
      <div v-else-if="error" class="max-w-xs">
        <Message severity="error" :closable="false">
          Error al cargar usuario: {{ error }}
        </Message>
      </div>

      <!-- User profile con PrimeVue Avatar y Badge -->
      <div v-else-if="user" class="flex items-center gap-4 sm:flex-col-reverse sm:gap-2 md:flex-row md:gap-4">
        <div class="text-right flex flex-col gap-1 sm:text-center md:text-right">
          <h3 class="text-lg font-semibold text-gray-800 m-0 sm:text-base">{{ user.nombre || 'Usuario' }}</h3>
          <Badge 
            :value="user.plan || 'Plan no disponible'" 
            :severity="getBadgeSeverity(user.plan)"
            class="self-end sm:self-center md:self-end"
          />
        </div>
        <Avatar 
          :label="user.nombre[0]"
          :image="user.avatar" 
          icon="pi pi-user"
          size="large" 
          shape="circle"
          class="mr-2"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="flex items-center gap-2 text-gray-500 text-sm">
        <i class="pi pi-user text-2xl"></i>
        <span>No hay usuario</span>
      </div>
    </div>
  </header>
</template>

