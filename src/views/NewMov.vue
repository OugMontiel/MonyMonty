<template>
  <div class="add-transaction-container">
    <div class="add-transaction">
      <h1>Agregar Nueva Transacción</h1>
      <form @submit.prevent="agregarTransaccion">
        <!-- Campo Fecha -->
        <div class="form-group">
          <label for="fecha">Fecha</label>
          <input type="date" id="fecha" v-model="transaccion.fecha" required />
        </div>

        <!-- Campo Categoría -->
        <div class="form-group">
          <label for="categoria">Categoría</label>
          <div class="input-with-display">
            <select v-model="transaccion.categoria" id="categoria" required @change="updateDisplay">
              <option value="" disabled>Selecciona una categoría</option>
              <option v-for="(categoria, index) in categorias" :key="index" :value="categoria">
                {{ categoria }}
              </option>
            </select>
            <div class="display-box">{{ transaccion.categoria || 'No seleccionada' }}</div>
          </div>
        </div>

        <!-- Campo Subcategoría -->
        <div class="form-group">
          <label for="subCategoria">Subcategoría</label>
          <div class="input-with-display">
            <select v-model="transaccion.subCategoria" id="subCategoria" @change="updateDisplay">
              <option value="" disabled>Selecciona una subcategoría</option>
              <option v-for="(subCategoria, index) in subCategorias" :key="index" :value="subCategoria">
                {{ subCategoria }}
              </option>
            </select>
            <div class="display-box">{{ transaccion.subCategoria || 'No seleccionada' }}</div>
          </div>
        </div>

        <!-- Campo Concepto -->
        <div class="form-group">
          <label for="concepto">Concepto</label>
          <input type="text" id="concepto" v-model="transaccion.concepto" placeholder="Escribe el concepto" />
        </div>

        <!-- Campo Entidad -->
        <div class="form-group">
          <label for="entidad">Entidad</label>
          <div class="input-with-display">
            <select v-model="transaccion.entidad" id="entidad" required @change="updateDisplay">
              <option value="" disabled>Selecciona una entidad</option>
              <option v-for="(entidad, index) in entidades" :key="index" :value="entidad">
                {{ entidad }}
              </option>
            </select>
            <div class="display-box">{{ transaccion.entidad || 'No seleccionada' }}</div>
          </div>
        </div>

        <!-- Campo Cuenta -->
        <div class="form-group">
          <label for="cuenta">N° de Cuenta</label>
          <div class="input-with-display">
            <select v-model="transaccion.cuenta" id="cuenta" @change="updateDisplay">
              <option value="" disabled>Selecciona una cuenta</option>
              <option v-for="(cuenta, index) in cuentas" :key="index" :value="cuenta">
                {{ cuenta }}
              </option>
            </select>
            <div class="display-box">{{ transaccion.cuenta || 'No seleccionada' }}</div>
          </div>
        </div>

        <!-- Campos Egreso e Ingreso -->
        <div class="form-group dual-input">
          <div>
            <label for="egreso">Egreso</label>
            <input type="number" id="egreso" v-model="transaccion.egreso" step="0.01" placeholder="0.00" />
          </div>
          <div>
            <label for="ingreso">Ingreso</label>
            <input type="number" id="ingreso" v-model="transaccion.ingreso" step="0.01" placeholder="0.00" />
          </div>
        </div>

        <!-- Campo Divisa -->
        <div class="form-group">
          <label for="divisa">Divisa</label>
          <div class="input-with-display">
            <select v-model="transaccion.divisa" id="divisa" required @change="updateDisplay">
              <option value="" disabled>Selecciona una divisa</option>
              <option v-for="(divisa, index) in divisa" :key="index" :value="divisa">
                {{ divisa }}
              </option>
            </select>
            <div class="display-box">{{ transaccion.divisa || 'No seleccionada' }}</div>
          </div>
        </div>

        <!-- Botón de envío -->
        <button type="submit" class="submit-btn">Agregar Transacción</button>

        <!-- Mensaje de éxito -->
        <div v-if="mostrarMensajeExito" class="success-message">
          ¡Transacción agregada exitosamente!
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";

export default {
  name: "AddTransaction",
  setup() {
    // Definición de variables
    let datos = ref([]);
    let documento = ref({});
    let categorias = ref([]);
    let subCategorias = ref([]);
    let entidades = ref([]);
    let cuentas = ref([]);
    let divisa = ref([]);
    let mostrarMensajeExito = ref(false); // Nueva variable para el mensaje
    let transaccion = ref({
      fecha: "",
      categoria: "",
      subCategoria: "",
      concepto: "",
      entidad: "",
      cuenta: "",
      egreso: 0,
      ingreso: 0,
      divisa: "",
    });

    // Funciones
    const cargarDatos = async () => {
      try {
        const response = await fetch("/DiegoMontiel.json");
        if (!response.ok) throw new Error("Error al cargar los datos");
        datos.value = await response.json();
        documento.value = datos.value.find((item) => item.nombre === "Diego Montiel");
        if (!documento.value) throw new Error("No se encontró el documento 'Diego Montiel'");
        categorias.value = Object.keys(documento.value.categorias);
        entidades.value = Object.keys(documento.value.entidades);
        divisa.value = Object.keys(documento.value.divisas);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const agregarTransaccion = async () => {
      const DatosEstructurados = {
        fecha: transaccion.value.fecha,
        categoria: { [transaccion.value.categoria]: transaccion.value.subCategoria },
        concepto: { [transaccion.value.concepto]: transaccion.value.descripcion },
        entidad: { [transaccion.value.entidad]: transaccion.value.cuenta },
        ingreso: transaccion.value.ingreso,
        egreso: transaccion.value.egreso,
        divisa: { [transaccion.value.divisa]: documento.value.divisas[transaccion.value.divisa]?.[0] },
      };

      if (DatosEstructurados.ingreso === 0) delete DatosEstructurados.ingreso;
      else if (DatosEstructurados.egreso === 0) delete DatosEstructurados.egreso;

      try {
        documento.value.transacciones.push(DatosEstructurados);
        console.log("Transacción agregada:", DatosEstructurados);
        // Mostrar mensaje de éxito
        mostrarMensajeExito.value = true;
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          mostrarMensajeExito.value = false;
        }, 3000);
      } catch (error) {
        console.error("Error al agregar la transacción:", error);
      }
    };

    const updateDisplay = () => {
      // Función vacía, mantenida por si necesitas lógica adicional en el futuro
    };

    // Observadores
    watch(() => transaccion.value.categoria, (categoriaSeleccionada) => {
      subCategorias.value = categoriaSeleccionada ? documento.value.categorias[categoriaSeleccionada] || [] : [];
    });

    watch(() => transaccion.value.entidad, (entidadSeleccionada) => {
      cuentas.value = entidadSeleccionada ? documento.value.entidades[entidadSeleccionada] || [] : [];
    });

    onMounted(() => cargarDatos());

    return {
      transaccion,
      agregarTransaccion,
      categorias,
      subCategorias,
      entidades,
      cuentas,
      divisa,
      mostrarMensajeExito, // Retornar la variable para usarla en el template
    };
  },
};
</script>

<style scoped>
.add-transaction-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7fa;
}

.add-transaction {
  width: 100%;
  max-width: 600px;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background-color: #fafafa;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
  outline: none;
}

.input-with-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  align-items: center;
}

.display-box {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #e9ecef;
  color: #495057;
  font-size: 14px;
  text-align: center;
}

.dual-input {
  display: flex;
  gap: 20px;
}

.dual-input > div {
  flex: 1;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.success-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #28a745;
  color: white;
  text-align: center;
  border-radius: 6px;
  font-size: 14px;
  animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}
</style>