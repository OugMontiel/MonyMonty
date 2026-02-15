<script setup>
import {ref, onMounted, computed, watch} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {Icon} from "@iconify/vue";
import {PERIOD_FILTERS, getCardDescription} from "../logic/dashBoardConstants.js";
import {dataMovimientos} from "../logic/movimientos.js";
import {useGlobalState} from "@/composables/useGlobalState";
import {useLoadingStore} from "@/stores/loadingStore";

const toast = useToast();
// const router = useRouter(); De momento no se usa por que no hay rutas ... pero se Usara
const {Cars} = dataMovimientos();
const dataDashBoard = ref({});
const loadingStore = useLoadingStore();
const {globalDataRefreshTrigger} = useGlobalState();

// Estado para el filtro de tiempo
const currentPeriod = ref(PERIOD_FILTERS.ANO);

// Obtener descripciones dinámicas
const cardInfo = computed(() => getCardDescription(currentPeriod.value));

// Formatear moneda
const formatearMoneda = (valor) => {
  if (valor === undefined || valor === null) return "$0";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
};

const redireccionar = (ruta) => {
  // Aquí implementaremos la navegación real cuando las rutas estén listas.
  // Por ahora mostramos feedback visual.
  toast.add({
    severity: "info",
    summary: "En desarrollo",
    detail: `Navegando a ${ruta}...`,
    life: 2000,
  });
};

const loadDashboardData = async () => {
  loadingStore.dashboardCards = true;
  try {
    const {data} = await Cars();
    dataDashBoard.value = data.data;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error de conexión",
      detail: "No se pudo cargar la información del Dashboard.",
      life: 4000,
    });
  } finally {
    loadingStore.dashboardCards = false;
  }
};

onMounted(() => {
  loadDashboardData();
});

watch(globalDataRefreshTrigger, () => {
  loadDashboardData();
});

const stats = computed(() => [
  {
    label: "Ingresos",
    description: cardInfo.value.description,
    value: dataDashBoard.value.totalIngresado,
    icon: "ion:cash-outline",
    action: () => redireccionar("ingresos"),
    borderClass: "hover:border-emerald-200",
    shadowClass: "hover:shadow-emerald-100",
    decorationClass: "bg-emerald-400",
    bgIconClass: "bg-emerald-50",
    colorClass: "text-emerald-500",
  },
  {
    label: "Gastos",
    description: cardInfo.value.description,
    value: dataDashBoard.value.totalEgresado,
    icon: "ion:card-outline",
    action: () => redireccionar("egresos"),
    borderClass: "hover:border-rose-200",
    shadowClass: "hover:shadow-rose-100",
    decorationClass: "bg-rose-400",
    bgIconClass: "bg-rose-50",
    colorClass: "text-rose-500",
  },
  {
    label: "Disponible",
    description: cardInfo.value.description,
    value: dataDashBoard.value.totalDisponible,
    icon: "ion:wallet-outline",
    action: () => redireccionar("egresos"),
    borderClass: "hover:border-indigo-200",
    shadowClass: "hover:shadow-indigo-100",
    decorationClass: "bg-indigo-400",
    bgIconClass: "bg-indigo-50",
    colorClass: "text-indigo-500",
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card
      v-for="(item, index) in stats"
      :key="index"
      @click="item.action && item.action()"
      class="group relative overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-lg !shadow-sm !rounded-2xl !bg-white"
      :class="[item.action ? 'cursor-pointer' : '', item.borderClass, item.shadowClass]"
    >
      <template #content>
        <!-- Background Decorator (Gradient blob) -->
        <div
          class="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 blur-2xl pointer-events-none"
          :class="item.decorationClass"
        ></div>

        <div class="flex flex-col justify-between h-full relative z-10">
          <!-- Header -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">{{ item.label }}</span>
              <!-- Message component usage if needed, or simple text. Using span as per design but imported Message available -->
              <span class="text-[11px] text-slate-400 font-medium">{{ item.description }}</span>
            </div>
            <!-- Icon Box -->
            <div class="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-sm" :class="item.bgIconClass">
              <Icon :icon="item.icon" class="w-6 h-6" :class="item.colorClass" />
            </div>
          </div>

          <!-- Value -->
          <div class="mt-1">
            <Skeleton v-if="loadingStore.dashboardCards" width="70%" height="2rem" borderRadius="8px" />
            <h3
              v-else
              class="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight text-ellipsis overflow-hidden whitespace-nowrap"
              :title="formatearMoneda(item.value)"
            >
              {{ formatearMoneda(item.value) }}
            </h3>
          </div>

          <!-- Interactiva Indicator -->
          <div
            v-if="item.action"
            class="absolute bottom-0 right-0 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Icon icon="ion:arrow-forward-outline" class="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
