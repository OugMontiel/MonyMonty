<script setup>
import {ref, onMounted, computed} from "vue";
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

onMounted(async () => {
  isLoading.value = true;
  try {
    //funciones
    const {data} = await Cars();

    dataDashBoard.value = data.data;
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
const stats = computed(() => [
  {
      },
]);
</script>

<template>
  <div class="w-full px-4 py-6">
    <!-- Grid de las Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- CARDS -->
      <h1>customers</h1>
    </div>
  </div>
</template>
