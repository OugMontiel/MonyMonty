<template>
  <main class="dashboard-container">
    <h1 class="dashboard-title">Panel de Transacciones</h1>

    <!--  Botón para alternar entre vista de tarjetas y tabla -->
    <button @click="toggleView" class="toggle-button">Cambiar a {{ vistaTabla ? "Tarjetas" : "Tabla" }}</button>

    <!--  Vista en Tarjetas -->
    <section v-if="!vistaTabla" class="transacciones-container">
      <car-mov v-for="(transaccion, index) in transacciones" :key="index" :info="transaccion" class="transaccion-card" />
    </section>

    <!--  Vista en Tabla -->
    <section v-else class="table-container">
      <table class="styled-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Categoría</th>
            <th>Concepto</th>
            <th>Entidad</th>
            <th>Ingreso/Egreso</th>
            <th>Divisa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaccion, index) in transacciones" :key="index">
            <td>{{ transaccion.fecha }}</td>
            <td>{{ formatJson(transaccion.categoria) }}</td>
            <td>{{ formatJson(transaccion.concepto) }}</td>
            <td>{{ formatJson(transaccion.entidad) }}</td>
            <td>{{ transaccion.ingreso }}</td>
            <td>{{ formatJson(transaccion.divisa) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script>
import {ref, onMounted} from "vue";
import carMov from "../components/dashBoard/cartaMovimiento.vue";

export default {
  name: "dashboard",
  components: {carMov},
  setup() {
    const datos = ref([]);
    const transacciones = ref([]);
    const vistaTabla = ref(false);

    const cargarDatos = async () => {
      try {
        const response = await fetch("/DiegoMontiel.json");
        if (!response.ok) throw new Error("Error al cargar los datos");

        datos.value = await response.json();
        transacciones.value = datos.value[0]?.transacciones || [];
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const toggleView = () => {
      vistaTabla.value = !vistaTabla.value;
    };

    // Función para formatear JSON y mostrar solo los valores legibles
    const formatJson = (data) => {
      if (typeof data === "object" && data !== null) {
        return Object.entries(data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
      }
      return data; // Si no es objeto, devuelve el valor tal cual
    };

    onMounted(cargarDatos);

    return {transacciones, vistaTabla, toggleView, formatJson};
  },
};
</script>

<style scoped>
/*  Contenedor principal */
.dashboard-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

/*  Título */
.dashboard-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

/*  Botón para alternar vista */
.toggle-button {
  background: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1rem;
  transition: background 0.3s;
}

.toggle-button:hover {
  background: #0056b3;
}

/*  Vista en Tarjetas */
.transacciones-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  justify-content: center;
  padding: 20px;
}

.transaccion-card {
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.transaccion-card:hover {
  transform: translateY(-5px);
}

/*  Vista en Tabla */
.table-container {
  overflow-x: auto;
  margin-top: 20px;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.styled-table th,
.styled-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.styled-table th {
  background-color: #007bff;
  color: white;
}

.styled-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.styled-table tbody tr:hover {
  background-color: #ddd;
}

/*  Diseño Responsive */
@media (max-width: 768px) {
  .dashboard-title {
    font-size: 1.8rem;
  }

  .transacciones-container {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .styled-table th,
  .styled-table td {
    padding: 8px;
    font-size: 0.9rem;
  }
}
</style>
