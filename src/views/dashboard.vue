<template>
  <main>
    <h1>Hola desde vista:</h1>

    <!-- Iteramos sobre los datos y pasamos cada uno al componente carMov -->
    <car-mov v-for="(transaccion, index) in transacciones" :key="index" :info="datos" />
  </main>
</template>

<script>
import { ref, onMounted } from "vue";
import carMov from "../components/carMov.vue";

export default {
  name: "dashboard",
  components: {
    carMov,
  },
  setup() {
    const datos = ref([]);
    const transacciones = ref([]);

    // Cargar datos desde el archivo JSON
    const cargarDatos = async () => {
      try {
        const response = await fetch("/DiegoMontiel.json");
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        datos.value = await response.json();
        console.log("Datos cargados:", datos.value); // Verificar que los datos se cargaron correctamente

        transacciones.value = datos.value[0].transacciones;
        console.log("Transacciones cargadas:", transacciones.value); // Verificar que las transacciones se extrajeron correctamente
      } catch (error) {
        console.error("Error:", error);
      }
    };

    onMounted(() => {
      console.log("Componente montado, iniciando carga de datos."); // Verificar que el componente se ha montado
      cargarDatos();
    });

    return {
      datos,
      transacciones, // Asegúrate de retornar transacciones si las necesitas en el template
    };
  },
};
</script>

<style>
/* Móvil Vertical (Regla General) */

/* Móvil Horizontal */
@media (min-width: 600px) and (max-width: 767px) {
  /* Estilos para móvil horizontal */
}

/* Tablet Vertical */
@media (min-width: 768px) and (max-width: 991px) {
  /* Estilos para tablet vertical */
}

/* Tablet Horizontal */
@media (min-width: 992px) and (max-width: 1199px) {
  /* Estilos para tablet horizontal y portátiles pequeños */
}

/* Portátil */
@media (min-width: 1200px) and (max-width: 1599px) {
  /* Estilos para portátiles */
}

/* PC de Escritorio */
@media (min-width: 1600px) {
  /* Estilos para PC de escritorio */
}

/* Reloj Inteligente */
@media (max-width: 299px) {
  /* Estilos para reloj inteligente */
}
</style>
