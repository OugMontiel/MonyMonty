<template>
  <div class="add-transaction">
    <h1>Agregar Nueva Transacción</h1>
    <form @submit.prevent="agregarTransaccion">
      <div>
        <label for="fecha">Fecha:</label>
        <input
          type="date"
          id="fecha"
          v-model="nuevaTransaccion.fecha"
          required
        />
      </div>
      <div>
        <label for="categoria">Categoría:</label>
        <select v-model="nuevaTransaccion.categoria">
          <option
            v-for="(categoria, index) in Categorías"
            :key="index"
            :value="categoria"
          >
            {{ categoria }}
          </option>
        </select>
        <input
          type="text"
          v-model="nuevaCategoria"
          placeholder="Nueva categoría"
        />
        <button type="button" @click="agregarCategoria">
          Agregar Categoría
        </button>
      </div>
      <div>
        <label for="subCategoria">Subcategoría:</label>
        <select v-model="nuevaTransaccion.subCategoria">
          <option
            v-for="(subCategoria, index) in subCategorias"
            :key="index"
            :value="subCategoria"
          >
            {{ subCategoria }}
          </option>
        </select>
        <input
          type="text"
          v-model="nuevaSubCategoria"
          placeholder="Nueva subcategoría"
        />
        <button type="button" @click="agregarSubCategoria">
          Agregar Subcategoría
        </button>
      </div>
      <div>
        <label for="concepto">Concepto:</label>
        <input
          type="text"
          id="concepto"
          v-model="nuevaTransaccion.concepto"
          required
        />
      </div>
      <div>
        <label for="entidad">Entidad:</label>
        <select v-model="nuevaTransaccion.entidad">
          <option
            v-for="(entidad, index) in entidades"
            :key="index"
            :value="entidad"
          >
            {{ entidad }}
          </option>
        </select>
        <input type="text" v-model="nuevaEntidad" placeholder="Nueva entidad" />
        <button type="button" @click="agregarEntidad">Agregar Entidad</button>
      </div>
      <div>
        <label for="cuenta">N° de Cuenta</label>
        <select v-model="nuevaTransaccion.cuenta">
          <option
            v-for="(cuenta, index) in Cuentas"
            :key="index"
            :value="cuenta"
          >
            {{ cuenta }}
          </option>
        </select>
        <input type="text" v-model="nuevaCuenta" placeholder="Nueva cuenta" />
        <button type="button" @click="agregarCuenta">Agregar Cuenta</button>
      </div>
      <div>
        <label for="egreso">Egreso:</label>
        <input
          type="number"
          id="egreso"
          v-model="nuevaTransaccion.egreso"
          step="0.01"
        />
      </div>
      <div>
        <label for="ingreso">Ingreso:</label>
        <input
          type="number"
          id="ingreso"
          v-model="nuevaTransaccion.ingreso"
          step="0.01"
        />
      </div>
      <div>
        <label for="divisa">Divisa:</label>
        <input
          type="text"
          id="divisa"
          v-model="nuevaTransaccion.divisa"
          required
        />
      </div>
      <button type="submit">Agregar Transacción</button>
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

    let Categorías = ref([]);
    let nuevaCategoria = ref("");

    let subCategorias = ref([]);
    let nuevaSubCategoria = ref("");

    let entidades = ref([]);
    let nuevaEntidad = ref("");

    let Cuentas = ref([]);
    let nuevaCuenta = ref("");

    let divisa = ref([]);
    let nuevaDivisa = ref("");

    let nuevaTransaccion = ref({
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
        console.log("Documento:", documento.value);

        //  Cargar variables de categoría, entidades y divisa por separado para poder agregar nuevas opciones
        Categorías = Object.keys(documento.value.Categorías);
        console.log("Variables de categoria:", Categorías);

        entidades = Object.keys(documento.value.entidades);
        console.log("Variables de entidades:", entidades);

        divisa = Object.keys(documento.value.divisas);
        console.log("Variables de divisa:", divisa);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const agregarCategoria = () => {
      if (
        nuevaCategoria.value &&
        !Categorías.value.includes(nuevaCategoria.value)
      ) {
        Categorías.value.push(nuevaCategoria.value);
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
      if (nuevaCuenta.value && !Cuentas.value.includes(nuevaCuenta.value)) {
        Cuentas.value.push(nuevaCuenta.value);
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
      console.log("Nueva transacción:", nuevaTransaccion.value);
      
      nuevaTransaccion.value = {
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

    // Observa cambios en la categoría seleccionada para actualizar las subcategorías
    watch(
      () => nuevaTransaccion.value.categoria,
      (nuevaCategoria) => {
        if (nuevaCategoria) {
          subCategorias.value = documento.Categorías[nuevaCategoria] || [];
        } else {
          subCategorias.value = [];
        }
      }
    );

    // Observa cambios en la entidad seleccionada para actualizar las cuentas
    watch(
      () => nuevaTransaccion.value.entidad,
      (nuevaCuenta) => {
        if (nuevaCuenta) {
          cuentas.value = documento.entidades[nuevaCuenta] || [];
        } else {
          cuentas.value = [];
        }
      }
    );

    onMounted(() => {
      cargarDatos();
    });

    return {
      nuevaTransaccion,
      agregarTransaccion,

      Categorías,
      nuevaCategoria,
      agregarCategoria,

      subCategorias,
      nuevaSubCategoria,
      agregarSubCategoria,

      entidades,
      nuevaEntidad,
      agregarEntidad,

      Cuentas,
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
