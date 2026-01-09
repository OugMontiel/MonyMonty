<script setup>
import {ref, onMounted, computed} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {Icon} from "@iconify/vue";
import {dataMovimientos} from "../../logic/movimientos.js";

const toast = useToast();
const router = useRouter();
const {Cars} = dataMovimientos();
const dataDashBoard = ref({});
const isLoading = ref(true);

//redireciones
//redireciones
const redirectToIngresos = () =>
  toast.add({
    severity: "info",
    summary: "En desarrollo",
    detail: "Próximamente sección de Ingresos.",
    life: 3000,
  });
const redirectToEgresos = () =>
  toast.add({
    severity: "info",
    summary: "En desarrollo",
    detail: "Próximamente sección de Egresos.",
    life: 3000,
  });
const redirectToMovimientos = () =>
  toast.add({
    severity: "info",
    summary: "En desarrollo",
    detail: "Próximamente vista detallada de Movimientos.",
    life: 3000,
  });

onMounted(async () => {
  isLoading.value = true;
  try {
    const {data} = await Cars();
    dataDashBoard.value = data.data;
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
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- CARDS -->
    <Card v-for="(item, index) in stats" :key="index" class="cursor-pointer hover:shadow-lg transition-shadow duration-300">
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
          <span v-if="isLoading">
            <ProgressSpinner style="width: 50px; height: 50px" />
          </span>
          <span v-else>
            <Message severity="success" variant="simple">
              {{ item.value }}
            </Message>
          </span>
        </h2>
      </template>
    </Card>
  </div>
</template>
