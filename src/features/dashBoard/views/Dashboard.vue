<script setup>
import {ref, onMounted} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {Icon} from "@iconify/vue";

import {dataMovimientos} from "../logic/movimientos.js";

const toast = useToast();
const router = useRouter();
const {Cars} = dataMovimientos();

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
    const dataCars = await Cars();

    dataDashBoard.value = dataCars;
    console.log("data", dataDashBoard);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error de conexión",
      detail: "Inténtalo de nuevo cargar el Usuario.",
      life: 4000,
    });
  } finally {
    isLoading.value = false;
  }
});
const stats = [
  {
    label: "Total ingresado",
    value: dataDashBoard.totalIngresado,
    icon: "ion:cash-outline",
    redirect: redirectToIngresos,
  },
  {
    label: "Último movimiento",
    value: dataDashBoard.ultimoMovimientos,
    icon: "ion:time-outline",
    redirect: redirectToMovimientos,
  },
  {
    label: "Total gastado",
    value: dataDashBoard.totalEgresado,
    icon: "ion:trending-down-outline",
    redirect: redirectToEgresos,
  },
  {
    label: "Disponible",
    value: dataDashBoard.totalDisponible,
    icon: "ion:wallet-outline",
    redirect: null,
  },
];
</script>

<template>
  <div class="w-full px-4 py-6">
    <!-- Grid de las Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- CARDS -->
      <Card v-for="(item, index) in stats" class="cursor-pointer hover:shadow-lg transition-shadow duration-300">
        <template #title>
          <div class="flex justify-between items-center">
            <Message severity="contrast" variant="simple">
              {{ item.label }}
            </Message>

            <!-- icono -->
            <Icon :icon="item.icon" class="w-5 h-5" @click.stop="item.redirect && item.redirect()" />
          </div>
        </template>

        <template #content>
          <h2 class="text-3xl font-bold mt-2">
            <span v-if="!isLoading">
              <ProgressSpinner style="width: 50px; height: 50px" />
              {{ item.value }}
            </span>
          </h2>
        </template>
      </Card>
    </div>
  </div>
</template>
