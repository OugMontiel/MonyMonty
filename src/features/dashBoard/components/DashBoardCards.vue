<script setup>
import {ref, onMounted, computed} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {Icon} from "@iconify/vue";
import {dataMovimientos} from "../logic/movimientos.js";

const toast = useToast();
// const router = useRouter(); De momento no se usa por que no hay rutas ... pero se Usara
const {Cars} = dataMovimientos();
const dataDashBoard = ref({});
const isLoading = ref(true);

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

onMounted(async () => {
  isLoading.value = true;
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
    isLoading.value = false;
  }
});

const stats = computed(() => [
  {
    label: "Ingresos",
    description: "Acumulado del mes",
    value: dataDashBoard.value.totalIngresado,
    icon: "solar:wad-of-money-bold-duotone",
    action: () => redireccionar("ingresos"),
  },
  {
    label: "Gastos",
    description: "Salidas registradas",
    value: dataDashBoard.value.totalEgresado,
    icon: "solar:card-transfer-bold-duotone",
    action: () => redireccionar("egresos"),
  },
  {
    label: "Disponible",
    description: "Balance actual",
    value: dataDashBoard.value.totalDisponible,
    icon: "solar:wallet-money-bold-duotone",
    action: () => redireccionar("egresos"),
  },
  {
    label: "Último movimiento",
    value: dataDashBoard.value.ultimoMovimientos,
    icon: "ion:time-outline",
    action: () => redireccionar("Ultimo movimiento"),
  },
]);
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div
      v-for="(item, index) in stats"
      :key="index"
      @click="item.action && item.action()"
      class="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden cursor-default"
      :class="[item.action ? 'cursor-pointer' : '', item.borderClass, item.shadowClass]"
    >
      <!-- Background Decorator (Gradient blob) -->
      <div
        class="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 blur-2xl pointer-events-none"
        :class="item.decorationClass"
      ></div>

      <div class="flex flex-col justify-between h-full relative z-10">
        <!-- Header -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex flex-col">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{{ item.label }}</span>
            <span class="text-[11px] text-slate-400 font-medium">{{ item.description }}</span>
          </div>
          <!-- Icon Box -->
          <div class="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-sm" :class="item.bgIconClass">
            <Icon :icon="item.icon" class="w-6 h-6" :class="item.colorClass" />
          </div>
        </div>

        <!-- Value -->
        <div class="mt-1">
          <Skeleton v-if="isLoading" width="70%" height="2rem" borderRadius="8px" />
          <h3
            v-else
            class="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight text-ellipsis overflow-hidden whitespace-nowrap"
            :title="formatearMoneda(item.value)"
          >
              {{ formatearMoneda(item.value) }}
          </h3>
        </div>

        <!-- Interactiva Indicator (Optional arrow logic) -->
        <div
          v-if="item.action"
          class="absolute bottom-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
        >
          <Icon icon="solar:arrow-right-linear" class="w-5 h-5 text-slate-400 hover:text-slate-600" />
        </div>
      </div>
    </div>
  </div>
</template>
