<script setup>
import {computed, ref, onMounted} from "vue";
import {dataMovimientos} from "../logic/movimientos.js";

const {getRankingCategorias} = dataMovimientos();

// PrimeVue Toast
import {useToast} from "primevue/usetoast";
const toast = useToast();

// Estado
const categoriaData = ref([]);
const loading = ref(true);
const activeCategoryIndex = ref(null);

// Cargar datos
const loadData = async () => {
  try {
    loading.value = true;
    const response = await getRankingCategorias();

    console.log("Response:", response);
    if (response?.data) {
      categoriaData.value = response.data.data;
    }
  } catch (error) {
    console.error("Error cargando datos:", error);
  } finally {
    loading.value = false;
  }
};

// Top subcategorías (vienen del backend, solo se muestran)
const getTopSubcategorias = (subcategorias, limit = 3) => {
  if (!subcategorias) return [];
  return subcategorias.slice(0, limit);
};

// Mostrar subcategorías (inline expansion)
const toggleCategoria = (index) => {
  if (activeCategoryIndex.value === index) {
    activeCategoryIndex.value = null;
  } else {
    activeCategoryIndex.value = index;
    irAAnalisis(categoriaData.value[index]);
  }
};

// Navegar a vista de análisis (con Toast)
const irAAnalisis = (categoria) => {
  toast.add({
    severity: "info",
    summary: "Análisis de Categoría",
    detail: `Explorando detalles de ${categoria.labelCategoria}`,
    life: 3000,
  });
  console.log("Análisis de:", categoria);
};

// Formatear moneda
const formatearMoneda = (valor) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="categoria-ranking w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <!-- Header -->
    <div class="mb-6 flex items-baseline justify-between">
      <h2 class="text-xl font-bold text-gray-900">Gastos por categoría</h2>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
    </div>

    <!-- Ranking List -->
    <div v-else class="space-y-4">
      <div
        v-for="(categoria, index) in categoriaData"
        :key="index"
        class="group relative cursor-pointer rounded-lg border border-gray-100 p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
        :class="{'border-blue-300 bg-blue-50': activeCategoryIndex === index}"
        @click="toggleCategoria(index)"
      >
        <!-- Contenedor Principal -->
        <div class="space-y-3">
          <!-- Fila 1: Categoría y Monto -->
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <!-- Nombre categoría y porcentaje -->
              <div>
                <h3 class="font-semibold text-gray-900">{{ categoria.labelCategoria }}</h3>
              </div>
            </div>

            <!-- Monto y Porcentaje -->
            <div class="text-right">
              <p class="text-lg font-bold text-gray-900">
                {{ formatearMoneda(categoria.montoCategoria) }}
              </p>
              <p class="text-sm font-semibold text-blue-600">{{ categoria.porcentajeCategoria }}%</p>
            </div>
          </div>

          <!-- Fila 2: Barra proporcional -->
          <div class="space-y-1">
            <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                class="h-full rounded-full transition-all duration-300"
                :style="{
                  width: `${categoria.porcentajeCategoria}%`,
                  background: `linear-gradient(90deg, ${getCategoryColor(categoria.labelCategoria).start}, ${getCategoryColor(categoria.labelCategoria).end})`,
                }"
              ></div>
            </div>
          </div>

          <!-- Fila 3: Top subcategorías (Expandible) -->
          <div v-if="activeCategoryIndex === index" class="mt-4 border-t border-blue-100 pt-3">
            <p class="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subcategorías más destacadas</p>
            <div class="space-y-2">
              <div
                v-for="sub in categoria.subcategorias"
                :key="sub.subcategoriaId"
                class="flex items-center justify-between rounded-md bg-white p-2 text-sm shadow-sm"
              >
                <span class="font-medium text-gray-700">{{ sub.labelSubcategoria }}</span>
                <span class="font-bold text-gray-900">{{ formatearMoneda(sub.montoSubcategoria) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Efecto hover (border animado) -->
        <div
          class="absolute inset-0 rounded-lg border-2 border-transparent transition-colors duration-200 group-hover:border-blue-300"
        ></div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && categoriaData.length === 0" class="py-8 text-center">
      <p class="text-gray-500">No hay datos de gastos disponibles</p>
    </div>
  </div>
</template>

<script>
// Funciones helper
const getCategoryEmoji = (categoria) => {
  const emojis = {
    Alimentación: "🍔",
    Transporte: "🚗",
    Entretenimiento: "🎬",
    Salud: "🏥",
    Educación: "📚",
    Vivienda: "🏠",
    Servicios: "💡",
    Compras: "🛍️",
    Deportes: "⚽",
    Mascotas: "🐕",
    Viajes: "✈️",
    Dinero: "💰",
  };
  return emojis[categoria] || "📊";
};

const getCategoryColor = (categoria) => {
  const colors = {
    Alimentación: {start: "#FF6B6B", end: "#FF8E8E"},
    Transporte: {start: "#4ECDC4", end: "#6FD9D0"},
    Entretenimiento: {start: "#FFD93D", end: "#FFEB6F"},
    Salud: {start: "#6BCB77", end: "#8FD995"},
    Educación: {start: "#4D96FF", end: "#7DB9FF"},
    Vivienda: {start: "#A566FF", end: "#C9A3FF"},
    Servicios: {start: "#FF6B9D", end: "#FF91B9"},
    Compras: {start: "#FF9FF3", end: "#FFB8FA"},
    Deportes: {start: "#FFB86C", end: "#FFCB9A"},
    Mascotas: {start: "#FF6B9D", end: "#FF91B9"},
    Viajes: {start: "#FF6B6B", end: "#FF8E8E"},
    Dinero: {start: "#F4D03F", end: "#F6D66F"},
  };
  return colors[categoria] || {start: "#95B8FF", end: "#B8D4FF"};
};
</script>

<style scoped>
.categoria-ranking {
  transition: all 0.3s ease;
}

.categoria-ranking:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Smooth animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.categoria-ranking > div {
  animation: fadeIn 0.3s ease;
}
</style>
