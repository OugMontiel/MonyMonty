<script setup>
import {ref, onMounted, computed} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";

import {dataMovimientos} from "../logic/movimientos.js";
import DashBoardCards from "../components/DashBoardCards.vue";
import DashBoardMovimientos from "../components/DashBoardMovimientos.vue";

const toast = useToast();
const router = useRouter();
const {Cars, getAllMovimientos} = dataMovimientos();
const movimientos = ref([]);

const dataDashBoard = ref({});
const isLoading = ref(true);

//redireciones
const redirectToIngresos = () => router.push({name: "Ingresos"});
const redirectToEgresos = () => router.push({name: "Egresos"});
const redirectToMovimientos = () => router.push({name: "Movimientos"});

onMounted(async () => {
  isLoading.value = true;
  try {
    //funciones
    const {data} = await Cars();
    const resMovs = await getAllMovimientos();

    dataDashBoard.value = data.data;
    // Asignar directamente, el backend ya envía ordenado
    movimientos.value = resMovs.data.data;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error de conexión",
      detail: "Inténtalo de nuevo cargar el DasBoard.",
      life: 4000,
    });
  } finally {
    isLoading.value = false;
  }
});

const stats = computed(() => [
  {
    label: "Total ingresado",
    value: dataDashBoard.value.totalIngresado,
    icon: "ion:cash-outline",
    redirect: redirectToIngresos,
  },
  {
    label: "Último movimiento",
    value: dataDashBoard.value.ultimoMovimientos,
    icon: "ion:time-outline",
    redirect: redirectToMovimientos,
  },
  {
    label: "Total gastado",
    value: dataDashBoard.value.totalEgresado,
    icon: "ion:trending-down-outline",
    redirect: redirectToEgresos,
  },
  {
    label: "Disponible",
    value: dataDashBoard.value.totalDisponible,
    icon: "ion:wallet-outline",
    redirect: null,
  },
]);
</script>

<template>
  <div class="w-full px-4 py-6 gap-4 flex flex-col">
    <!-- Grid de las Cards -->
    <DashBoardCards :stats="stats" :is-loading="isLoading" />

    <!-- Tabla de Movimientos -->
    <DashBoardMovimientos :movimientos="movimientos" />
  </div>
</template>
