<template>
  <div class="add-transaction">
    <h1>Agregar Nueva Transacción</h1>
    <form @submit.prevent="agregarTransaccion">
      <!-- Fecha -->
      <div>
        <label for="fecha">Fecha:</label>
        <input type="date" id="fecha" v-model="transaccion.fecha" required />
      </div>

      <!-- Categoría -->
      <div>
<!-- titulo -->
        <label for="categoria">Categoría:</label>

        <!-- Seccion de categorias -->
        <select v-model="transaccion.categoria">
          <option
            v-for="(categoria, index) in categorias"
            :key="index"
            :value="categoria"
          >
            {{ categoria }}
          </option>
        </select>

        <!-- boton para agregar nueva categoria -->
        <button type="button" @click="agregarCategoria">
          Agregar Categoría
        </button>

        <!-- imput de nueva categoria -->
        <input
          type="text"
          v-model="nuevaCategoria"
          placeholder="Nueva categoría"
        />
              </div>

      <!-- Subcategoría -->
      <div>
<!-- titulo -->
        <label for="subCategoria">Subcategoría:</label>

        <!-- Seccion de subcategorias -->
        <select v-model="transaccion.subCategoria">
          <option
            v-for="(subCategoria, index) in subCategorias"
            :key="index"
            :value="subCategoria"
          >
            {{ subCategoria }}
          </option>
        </select>

        <!-- boton para agregar nueva subcategoria -->
        <button type="button" @click="agregarSubCategoria">
          Agregar Subcategoría
        </button>

        <!-- imput de nueva subcategoria -->
        <input
          type="text"
          v-model="nuevaSubCategoria"
          placeholder="Nueva subcategoría"
        />
              </div>

      <!-- Concepto -->
      <div>
<!-- titulo -->
        <label for="concepto">Concepto:</label>

        <!-- imput de concepto -->
        <input type="text" id="concepto" v-model="transaccion.concepto" />
      </div>

      <!-- Entidad -->
      <div>
<!-- Titulo -->
        <label for="entidad">Entidad:</label>

        <!-- seleccion de entidades -->
        <select v-model="transaccion.entidad">
          <option
            v-for="(entidad, index) in entidades"
            :key="index"
            :value="entidad"
          >
            {{ entidad }}
          </option>
        </select>

        <!-- boton para agregar nueva entidad -->
        <button type="button" @click="agregarEntidad">Agregar Entidad</button>

        <!-- imput de nueva entidad -->
        <input type="text" v-model="nuevaEntidad" placeholder="Nueva entidad" />
              </div>

      <!-- Cuenta -->
      <div>
<!-- Titulo -->
        <label for="cuenta">N° de Cuenta</label>

        <!-- seleccion de cuentas -->
        <select v-model="transaccion.cuenta">
          <option
            v-for="(cuenta, index) in cuentas"
            :key="index"
            :value="cuenta"
          >
            {{ cuenta }}
          </option>
        </select>

        <!-- boton para agregar nueva cuenta -->
        <button type="button" @click="agregarCuenta">Agregar Cuenta</button>

        <!-- imput de nueva cuenta -->
        <input type="text" v-model="nuevaCuenta" placeholder="Nueva cuenta" />
              </div>

      <!-- Egreso -->
      <div>
<!-- Titulo -->
        <label for="egreso">Egreso:</label>

        <!-- imput de egreso -->
        <input
          type="number"
          id="egreso"
          v-model="transaccion.egreso"
          step="0.01"
        />
      </div>

      <!-- Ingreso -->
      <div>
<!-- Titulo -->
        <label for="ingreso">Ingreso:</label>

        <!-- imput de Ingreso -->
        <input
          type="number"
          id="ingreso"
          v-model="transaccion.ingreso"
          step="0.01"
        />
      </div>

      <!-- Divisa -->
      <div>
<!-- Titulo -->
        <label for="divisa">Divisa:</label>

        <!-- Seleccion de Divisa -->
        <select v-model="transaccion.divisa">
          <option
            v-for="(divisa, index) in divisa"
            :key="index"
            :value="divisa"
          >
            {{ divisa }}
          </option>
        </select>

        <!-- boton para agregar nueva divisa -->
        <button type="button" @click="agregarDivisa">Agregar Divisa</button>

        <!-- imput de nueva divisa -->
        <input type="text" v-model="nuevaDivisa" placeholder="Nueva divisa" />
              </div>

      <!-- Boton de envio  -->
      <button type="submit" @click="AgregarDatos()">Agregar Transacción</button>
    </form>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";

export default {
  name: "AddTransaction",
  setup() {
    let datos = ref([]);
    let documento = ref({});

    let categorias = ref([]);
    let nuevaCategoria = ref("");

    let subCategorias = ref([]);
    let nuevaSubCategoria = ref("");

    let entidades = ref([]);
    let nuevaEntidad = ref("");

    let cuentas = ref([]);
    let nuevaCuenta = ref("");

    let divisa = ref([]);
    let nuevaDivisa = ref("");

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

    const cargarDatos = async () => {
      try {
        const response = await fetch("/DiegoMontiel.json");
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        datos.value = await response.json();
        // console.log("Datos cargados:", datos.value); // Verificar que los datos se cargaron correctamente

        // Buscar el documento con el nombre 'Diego Montiel'
        documento.value = datos.value.find(
          (item) => item.nombre === "Diego Montiel"
        );
// console.log("Documento:", documento.value);

        //  Cargar variables de categoría, entidades y divisa por separado para poder agregar nuevas opciones
        categorias.value = Object.keys(documento.value.categorias);
// console.log("Variables de categoria:", categorias);

        entidades.value = Object.keys(documento.value.entidades);
// console.log("Variables de entidades:", entidades);

        divisa.value = Object.keys(documento.value.divisas);
// console.log("Variables de divisa:", divisa);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const agregarCategoria = () => {
      if (
        nuevaCategoria.value &&
        !categorias.value.includes(nuevaCategoria.value)
      ) {
        categorias.value.push(nuevaCategoria.value);
        nuevaCategoria.value = "";
      }
    };

    const agregarSubCategoria = () => {
      if (
        nuevaSubCategoria.value &&
        !subCategorias.value.includes(nuevaSubCategoria.value)
      ) {
        subCategorias.value.push(nuevaSubCategoria.value);
        nuevaSubCategoria.value = "";
      }
    };

    const agregarEntidad = () => {
      if (nuevaEntidad.value && !entidades.value.includes(nuevaEntidad.value)) {
        entidades.value.push(nuevaEntidad.value);
        nuevaEntidad.value = "";
      }
    };

    const agregarCuenta = () => {
      if (nuevaCuenta.value && !cuentas.value.includes(nuevaCuenta.value)) {
        cuentas.value.push(nuevaCuenta.value);
        nuevaCuenta.value = "";
      }
    };

    const agregarDivisa = () => {
      if (nuevaDivisa.value && !divisa.value.includes(nuevaDivisa.value)) {
        divisa.value.push(nuevaDivisa.value);
        nuevaDivisa.value = "";
      }
    };

    const agregarTransaccion = () => {
      console.log("Nueva transacción:", transaccion.value);
      
      transaccion.value = {
        fecha: "",
        categoria: "",
        subCategoria: "",
        concepto: "",
        entidad: "",
        cuenta: "",
        egreso: 0,
        ingreso: 0,
        divisa: "",
      };
    };

    // Observa cambios en la categoría seleccionada para actualizar las subCategorias
    watch(
      () => transaccion.value.categoria,
      (categoriaSeleccionada) => {
// console.log("Categoría seleccionada:", categoriaSeleccionada); // Muestra la nueva categoría seleccionada

        if (categoriaSeleccionada) {
          subCategorias.value =
documento.value.categorias[categoriaSeleccionada] || [];
// console.log("Subcategorías actualizadas:", subCategorias.value); // Muestra las subcategorías actualizadas
                } else {
          subCategorias.value = [];
// console.log("No hay categoría seleccionada, subcategorías vacías."); // Mensaje cuando no hay categoría seleccionada
        }
      }
    );

    // Observa cambios en la entidad seleccionada para actualizar las cuentas
    watch(
      () => transaccion.value.entidad,
      (cuentaSeleccionada) => {
        // console.log("Entidad seleccionada:", cuentaSeleccionada); // Muestra la nueva entidad seleccionada

        if (cuentaSeleccionada) {
          cuentas.value = documento.value.entidades[cuentaSeleccionada] || [];
// console.log("Cuentas actualizadas:", cuentas.value); // Muestra las cuentas actualizadas
        } else {
          cuentas.value = [];
// console.log("No hay entidad seleccionada, cuentas vacías."); // Mensaje cuando no hay entidad seleccionada
        }
      }
    );

    onMounted(() => {
      cargarDatos();
    });

    return {
      transaccion,
      agregarTransaccion,

      categorias,
      nuevaCategoria,
      agregarCategoria,

      subCategorias,
      nuevaSubCategoria,
      agregarSubCategoria,

      entidades,
      nuevaEntidad,
      agregarEntidad,

      cuentas,
      nuevaCuenta,
      agregarCuenta,

      divisa,
      nuevaDivisa,
      agregarDivisa,
    };
  },
};
</script>

<style scoped>
.add-transaction {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

form div {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
