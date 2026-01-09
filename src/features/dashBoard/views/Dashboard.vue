<script setup>
import {ref, onMounted, computed} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import _ from "lodash";

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
    // Ordenar por fecha descendente
    movimientos.value = _.orderBy(resMovs.data.data, ["fecha"], ["desc"]);
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
// Formatea un objeto de movimiento en un resumen legible
const formatLastMovement = (m) => {
  if (!m) return "—";
  const item = _.first(_.castArray(m));
  if (!item) return "—";

  const fecha = item.fecha;
  const amount = item.egreso ?? item.ingreso ?? null;

  let currency = "";
  if (_.isPlainObject(item.divisa)) {
    currency = _.first(Object.keys(item.divisa));
  }

  const amountStr = _.compact([amount, currency]).join(" ");

  const extractKV = (obj) => {
    if (!_.isPlainObject(obj) || _.isEmpty(obj)) return "";

    const key = _.head(_.keys(obj));
    const val = obj[key];

    return _.isNil(val) || val === "" ? key : `${key}: ${val}`;
  };

  const entidad = extractKV(item.entidad);

  const parts = [];
  if (fecha) parts.push(fecha);
  if (amountStr) parts.push(amountStr);
  if (entidad) parts.push(entidad);

  return parts.join(" - ");
};
const stats = computed(() => [
  {
    label: "Total ingresado",
    value: dataDashBoard.value.totalIngresado,
    icon: "ion:cash-outline",
    redirect: redirectToIngresos,
  },
  {
    label: "Último movimiento",
    value: formatLastMovement(dataDashBoard.value.ultimoMovimientos),
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
