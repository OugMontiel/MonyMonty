<script setup>
import {computed, ref, onMounted} from "vue";
import {dataMovimientos} from "../logic/movimientos.js";

const {getRankingCategorias} = dataMovimientos();

// Estado
const categoriaData = ref([]);
const loading = ref(true);
const selectedCategory = ref(null);
const tooltip = ref({show: false, x: 0, y: 0, data: null});

// Datos del mes actual y mes anterior
const currentMonth = ref(new Date());
const previousMonth = computed(() => {
  const prev = new Date(currentMonth.value);
  prev.setMonth(prev.getMonth() - 1);
  return prev;
});

// Calcular total de gastos
const totalGastos = computed(() => {
  return categoriaData.value.reduce((sum, cat) => sum + (cat.montoCategoria || 0), 0);
});

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

// Calcular porcentaje
const calcularPorcentaje = (monto) => {
  if (totalGastos.value === 0) return 0;
  return Math.round((monto / totalGastos.value) * 100);
};

// Tendencia (Removida a petición del usuario ya que no se requiere el saldo del mes anterior)
const tendencia = (categoria) => {
  return {porcentaje: 0, tipo: "neutral"};
};

// Top subcategorías (vienen del backend, solo se muestran)
const getTopSubcategorias = (subcategorias, limit = 3) => {
  if (!subcategorias) return [];
  return subcategorias.slice(0, limit);
};

// Mostrar tooltip
const mostrarTooltip = (event, categoria) => {
  const rect = event.target.getBoundingClientRect();
  tooltip.value = {
    show: true,
    x: rect.left,
    y: rect.top - 10,
    data: {
      labelCategoria: categoria.labelCategoria,
      subcategorias: getTopSubcategorias(categoria.subcategorias, 5),
    },
  };
};

// Ocultar tooltip
const ocultarTooltip = () => {
  tooltip.value.show = false;
};

// Navegar a vista de análisis
const irAAnalisis = (categoria) => {
  selectedCategory.value = categoria;
  // Implementar navegación a vista de análisis
  console.log("Navegar a análisis de:", categoria);
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
      <h2 class="text-xl font-bold text-gray-900">📊 Gastos por categoría (mes actual)</h2>
      <div class="text-right">
        <p class="text-sm text-gray-600">Total</p>
        <p class="text-2xl font-bold text-gray-900">
          {{ formatearMoneda(totalGastos) }}
        </p>
      </div>
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
        class="group relative rounded-lg border border-gray-100 p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
        @mouseenter="mostrarTooltip($event, categoria)"
        @mouseleave="ocultarTooltip"
        @click="irAAnalisis(categoria)"
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
              <p class="text-sm font-semibold text-blue-600">{{ calcularPorcentaje(categoria.montoCategoria) }}%</p>
            </div>
          </div>

          <!-- Fila 2: Barra proporcional -->
          <div class="space-y-1">
            <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                class="h-full rounded-full transition-all duration-300"
                :style="{
                  width: `${calcularPorcentaje(categoria.montoCategoria)}%`,
                  background: `linear-gradient(90deg, ${getCategoryColor(categoria.labelCategoria).start}, ${getCategoryColor(categoria.labelCategoria).end})`,
                }"
              ></div>
            </div>
          </div>

          <!-- Fila 3: Top subcategorías -->
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <!-- Top subcategorías -->
            <div class="flex flex-wrap gap-2">
              <div
                v-for="sub in getTopSubcategorias(categoria.subcategorias)"
                :key="sub.subcategoriaId"
                class="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors group-hover:bg-gray-200"
              >
                {{ sub.labelSubcategoria }}
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

  <!-- Tooltip -->
  <div
    v-if="tooltip.show && tooltip.data"
    class="fixed z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
    :style="{
      left: `${tooltip.x}px`,
      top: `${tooltip.y}px`,
      transform: 'translateY(-100%) translateX(-50%)',
    }"
  >
    <div class="min-w-64 space-y-2">
      <h4 class="font-bold text-gray-900">{{ tooltip.data.labelCategoria }}</h4>

      <div v-if="tooltip.data.subcategorias.length > 0" class="border-t border-gray-200 pt-2">
        <p class="mb-2 text-xs font-semibold text-gray-700">Subcategorías</p>
        <div class="space-y-1">
          <div v-for="sub in tooltip.data.subcategorias" :key="sub.subcategoriaId" class="flex justify-between text-xs text-gray-600">
            <span>{{ sub.labelSubcategoria }}</span>
            <span class="font-medium">{{ formatearMoneda(sub.montoSubcategoria) }}</span>
          </div>
        </div>
      </div>
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
