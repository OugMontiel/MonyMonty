<script setup>
import {ref, onMounted} from "vue";
import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";

import {dataMovimientos} from "../logic/movimientos.js";

const toast = useToast();
const router = useRouter();
const {UltimoMovimientos, TotalIngresado, TotalEgresado} = dataMovimientos();

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
    const ultimoMov = await UltimoMovimientos();
    const totalIng = await TotalIngresado();
    const totalEgr = await TotalEgresado();

    dataDashBoard.value = {
      ultimoMovimientos: ultimoMov,
      totalIngresado: totalIng,
      totalEgresado: totalEgr,
    };
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
</script>

<template>
  
  <div>
    <div>
      <h2>Ingresos</h2>     
    </div>

    <div >
      <h2 >Movimientos</h2>
     
    </div>

    <div >
      <h2 >Gastos</h2>
      
    </div>
  </div>
</template>

