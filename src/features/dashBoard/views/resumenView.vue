<script>
import Chart from "chart.js/auto";

export default {
  name: "ingresosView",
  data() {
    return {
      ingresos: [
        {nombre: "Sueldo", valor: 1200},
        {nombre: "Porlote", valor: 550},
        {nombre: "Sueldo", valor: 200},
        {nombre: "Porlote", valor: 55},
        {nombre: "Sueldo", valor: 1200},
        {nombre: "Porlote", valor: 55},
        {nombre: "Sueldo", valor: 1200},
        {nombre: "Porlote", valor: 55},
        {nombre: "Sueldo", valor: 1200},
        {nombre: "Porlote", valor: 55},
        {nombre: "Porlote", valor: 550},
      ],
      gastos: [
        {nombre: "Manilla", valor: -10},
        {nombre: "Colchon", valor: -500},
        {nombre: "Manilla", valor: -100},
        {nombre: "Colchon", valor: -200},
        {nombre: "Manilla", valor: -10},
        {nombre: "Colchon", valor: -200},
      ],
    };
  },
  computed: {
    movimientos() {
      return [...this.ingresos, ...this.gastos];
    },
  },
  mounted() {
    this.renderChart(this.$refs.chartIngresos, this.ingresos, "rgb(0, 200, 0)");
    this.renderChart(this.$refs.chartGastos, this.gastos, "rgb(200, 0, 0)");
  },
  methods: {
    renderChart(canvas, data, color) {
      new Chart(canvas, {
        type: "doughnut",
        data: {
          labels: data.map((i) => i.nombre),
          datasets: [
            {
              data: data.map((i) => Math.abs(i.valor)),
              backgroundColor: data.map(() => color),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {display: false},
          },
        },
      });
    },
  },
};
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Bienvenido al panel de control</p>
  </div>
  <div class="dashboard">
    <div class="panel-ingresos">
      <h2 class="ingresos-h2">Ingresos</h2>
      <div class="chart-container">
        <canvas ref="chartIngresos"></canvas>
      </div>
      <div class="tarjetas-ingresos">
        <div class="ingresos-positivo" v-for="item in movimientos.filter((i) => i.valor >= 0).slice(-5)" :key="item.nombre">
          <p class="ingresos-nombre">{{ item.nombre }}</p>
          <p class="ingresos-valor">+{{ item.valor }}</p>
        </div>
      </div>
    </div>

    <div class="panel-movimientos">
      <h2 class="movimientos-h2">Movimientos</h2>
      <ul class="tarjetas-movimientos">
        <li
          v-for="item in movimientos.slice(-5)"
          :key="item.nombre"
          class="tarjeta-movimientos"
          :class="item.valor >= 0 ? 'movimientos-positivo' : 'movimientos-negativo'"
        >
          <p class="movimientos-nombre">{{ item.nombre }}</p>
          <p class="movimientos-valor">{{ item.valor >= 0 ? "+" : "" }}{{ item.valor }}</p>
        </li>
      </ul>
    </div>

    <div class="panel-gastos">
      <h2 class="gastos-h2">Gastos</h2>
      <div class="chart-container">
        <canvas ref="chartGastos"></canvas>
      </div>
      <div class="tarjetas-gastos">
        <div class="gastos-negativo" v-for="item in movimientos.filter((i) => i.valor < 0).slice(-5)" :key="item.nombre">
          <p class="gastos-nombre">{{ item.nombre }}</p>
          <p class="gastos-valor">{{ item.valor }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Panel para ingresos */

.panel-ingresos {
  width: 30%;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 2px 2px 6px #ddd;
}

.ingresos-h2 {
  margin-bottom: 20px;
  text-align: center;
}

.chart-container {
  width: 100%;
  max-width: 200px;
  margin: 0 auto 10px auto;
}

.tarjetas-ingresos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ingresos-positivo {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  background-color: #e6fbe6;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
}

.ingresos-positivo:hover {
  transform: scale(1.02);
}

.ingresos-nombre {
  font-weight: bold;
  color: green;
  margin: 0;
}

.ingresos-valor {
  margin: 0;
  color: green;
}

/* Panel para movimientos */

.panel-movimientos {
  width: 30%;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 2px 2px 6px #ddd;
}

.movimientos-h2 {
  margin-bottom: 20px;
  text-align: center;
}

.tarjetas-movimientos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tarjeta-movimientos {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9f9f9;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
}

.tarjeta-movimientos:hover {
  transform: scale(1.02);
}

.movimientos-nombre {
  font-weight: bold;
  margin: 0;
}

.movimientos-valor {
  margin: 0;
}

.movimientos-positivo {
  background-color: #e6fbe6;
  color: green;
}

.movimientos-negativo {
  background-color: #fdeaea;
  color: red;
}

/* Panel para gastos */

.panel-gastos {
  width: 30%;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 2px 2px 6px #ddd;
}

.gastos-h2 {
  margin-bottom: 20px;
  text-align: center;
}

.tarjetas-gastos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gastos-ingresos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gastos-negativo {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  background-color: #fdeaea;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
}

.gastos-negativo:hover {
  transform: scale(1.02);
}

.gastos-nombre {
  font-weight: bold;
  color: red;
  margin: 0;
}

.gastos-valor {
  margin: 0;
  color: red;
}
</style>
