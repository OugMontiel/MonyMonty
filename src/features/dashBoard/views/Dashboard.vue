<script setup>
import {ref, onMounted, computed} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";
import {Icon} from "@iconify/vue";
import _ from "lodash";

import {dataMovimientos} from "../logic/movimientos.js";

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

    <!-- Tabla de Movimientos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="col-span-1 shadow-md bg-white rounded-lg p-4 overflow-hidden">
        <h3 class="text-xl font-bold mb-4">Últimos Movimientos</h3>
        <DataTable
          :value="movimientos"
          responsiveLayout="scroll"
          :paginator="true"
          :rows="5"
          sortField="fecha"
          :sortOrder="-1"
          class="text-sm"
        >
          <template #empty>No hay movimientos encontrados.</template>
          <Column field="referencia" header="Ref" sortable></Column>
          <Column field="origen" header="Origen" sortable class="hidden sm:table-cell"></Column>
          <Column header="Entidad">
            <template #body="slotProps">
              <span v-if="slotProps.data.tipo === 'TRANSFERENCIA'"> Transferencia </span>
              <span v-else>
                {{ slotProps.data.entidadId }}
              </span>
            </template>
          </Column>
          <Column field="fecha" header="Fecha" sortable>
            <template #body="slotProps">
              {{ new Date(slotProps.data.fecha).toLocaleDateString() }}
            </template>
          </Column>
          <Column field="monto" header="Monto" sortable>
            <template #body="slotProps">
              <span :class="{'text-red-500': slotProps.data.tipo === 'EGRESO', 'text-green-500': slotProps.data.tipo === 'INGRESO'}">
                {{ slotProps.data.monto }}
              </span>
            </template>
          </Column>
          <Column field="tipo" header="Tipo" sortable></Column>
          <Column field="categoriaId" header="Cat" class="hidden md:table-cell"></Column>
          <Column field="subcategoriaId" header="Sub" class="hidden md:table-cell"></Column>
          <Column field="divisaId" header="Div" class="hidden md:table-cell"></Column>
        </DataTable>
      </div>
      <!-- Espacio reservado para la derecha en pantallas grandes -->
      <div class="hidden lg:block col-span-1"></div>
    </div>
  </div>
</template>
