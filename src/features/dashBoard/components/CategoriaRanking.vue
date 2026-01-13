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
  <Card class="categoria-ranking shadow-sm border-0 bg-white overflow-hidden">
    <template #title>
      <div class="flex items-center gap-2 text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">
        <i class="pi pi-chart-bar text-blue-500"></i>
        Gastos por categoría
      </div>
    </template>

    <template #content>
      <!-- Loading state with Skeleton -->
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="p-4 rounded-lg border border-gray-50">
          <div class="flex justify-between mb-4">
            <div class="flex gap-3">
              <Skeleton shape="circle" size="3rem" />
              <div class="space-y-2">
                <Skeleton width="8rem" height="1.2rem" />
                <Skeleton width="4rem" height="0.8rem" />
              </div>
            </div>
            <Skeleton width="6rem" height="2rem" />
          </div>
          <Skeleton width="100%" height="0.5rem" />
        </div>
      </div>

      <!-- Ranking List -->
      <div v-else-if="categoriaData.length > 0" class="space-y-4">
        <div
          v-for="(categoria, index) in categoriaData"
          :key="index"
          class="group relative cursor-pointer rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-lg"
          :class="{'border-blue-300 bg-blue-50 ring-1 ring-blue-100': activeCategoryIndex === index}"
          @click="toggleCategoria(index)"
        >
          <!-- Contenedor Principal -->
          <div class="space-y-4">
            <!-- Fila 1: Categoría y Monto -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <!-- Icono/Emoji con Estilo Premium -->
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-xl shadow-inner transition-transform group-hover:scale-110"
                  :style="{
                    background: `linear-gradient(135deg, ${categoria.colorCategoria || '#3B82F6'}20, ${categoria.colorCategoria || '#60A5FA'}40)`,
                    color: categoria.colorCategoria || '#3B82F6',
                  }"
                >
                  <span class="text-2xl drop-shadow-sm">{{ categoria.iconoCategoria || "📊" }}</span>
                </div>

                <div>
                  <h3 class="font-bold text-gray-800 text-lg leading-tight">{{ categoria.labelCategoria }}</h3>
                  <span class="text-xs font-medium text-gray-500 uppercase tracking-widest">Distribución mensual</span>
                </div>
              </div>

              <!-- Monto y Porcentaje -->
              <div class="text-right">
                <p class="text-xl font-black text-gray-900 leading-none mb-1">
                  {{ formatearMoneda(categoria.montoCategoria) }}
                </p>
                <Tag :value="`${categoria.porcentajeCategoria}%`" severity="info" rounded class="font-bold text-xs" />
              </div>
            </div>

            <!-- Fila 2: Barra proporcional con PrimeVue ProgressBar -->
            <div class="space-y-1">
              <ProgressBar
                :value="categoria.porcentajeCategoria"
                :showValue="false"
                class="premium-progress"
                :style="{
                  '--p-progressbar-value-background': `linear-gradient(90deg, ${categoria.colorCategoria || '#3B82F6'}, ${categoria.colorCategoria || '#60A5FA'})`,
                }"
              />
            </div>

            <!-- Fila 3: Top subcategorías (Expandible) -->
            <transition name="p-transition-fade">
              <div
                v-if="activeCategoryIndex === index"
                class="mt-4 border-t border-blue-100 pt-4 animate-in slide-in-from-top-2 duration-300"
              >
                <div class="flex items-center gap-2 mb-3">
                  <i class="pi pi-list-check text-blue-400 text-xs"></i>
                  <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest">Detalle de subcategorías</p>
                </div>
                <div class="grid gap-2">
                  <div
                    v-for="sub in categoria.subcategorias"
                    :key="sub.subcategoriaId"
                    class="flex items-center justify-between rounded-xl bg-white p-3 text-sm border border-gray-50 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div class="flex items-center gap-2">
                      <div class="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
                      <span class="font-semibold text-gray-600">{{ sub.labelSubcategoria }}</span>
                    </div>
                    <span class="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">{{
                      formatearMoneda(sub.montoSubcategoria)
                    }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <i class="pi pi-chart-line text-4xl text-gray-300 mb-3"></i>
        <p class="text-gray-500 font-medium">No hay datos de gastos disponibles para este mes</p>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.categoria-ranking :deep(.p-card-body) {
  padding: 1.5rem;
}

.premium-progress {
  height: 8px !important;
  background-color: #f3f4f6 !important;
  border-radius: 999px !important;
  overflow: hidden;
}

.premium-progress :deep(.p-progressbar-value) {
  background: var(--p-progressbar-value-background);
  border-radius: 999px !important;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Animations */
.animate-in {
  animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
