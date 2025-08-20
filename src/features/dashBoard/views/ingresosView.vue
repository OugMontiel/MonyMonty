<script>
import Chart from "chart.js/auto";

export default {
    name: "ingresosView",
    data() {
        return {
            ingresos: [
                { nombre: "Sueldo", valor: 1200 },
                { nombre: "Porlote", valor: 550 },
                { nombre: "Sueldo", valor: 200 },

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
                        legend: { display: false },
                    },
                },
            });
        },
    },
};
</script>

<template>
    <table>
  <thead>
    <tr>
      <th>Descripción</th>
      <th>Categoría</th>
      <th>Monto</th>
      <th>Fecha</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Almuerzo</td>
      <td>Comida</td>
      <td>$12.000</td>
      <td>2025-07-29</td>
    </tr>
    <tr>
      <td>Transporte</td>
      <td>Movilidad</td>
      <td>$5.000</td>
      <td>2025-07-29</td>
    </tr>
  </tbody>


</table>

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
