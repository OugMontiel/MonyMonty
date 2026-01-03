<script setup>
import {ref, computed} from "vue";
import {useToast} from "primevue/usetoast";
import {useMovimientos} from "../logic/useMovimientos";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:visible", "saved"]);

const toast = useToast();
const {createMovimiento, loading} = useMovimientos();

const movementTypes = [
  {label: "Ingreso", value: "INGRESO"},
  {label: "Egreso", value: "EGRESO"},
  {label: "Transferencia", value: "TRANSFERENCIA"},
];

// Form Data
const form = ref({
  tipo: "EGRESO",
  entidadId: null,
  origenEntidadId: null,
  destinoEntidadId: null,
  monto: null,
  fecha: new Date(),
  concepto: {
    titulo: "",
    detalle: "",
  },
  categoriaId: null,
  subcategoriaId: null,
  tags: [],
  divisaId: null, // Should be set to default or selected
});

// Mock Data (Replace with API calls)
const entidades = ref([]); // TODO: Fetch from API
const categorias = ref([]); // TODO: Fetch from API
const subcategorias = ref([]); // TODO: Fetch from API
const divisas = ref([]); // TODO: Fetch from API

const isTransferencia = computed(() => form.value.tipo === "TRANSFERENCIA");

const close = () => {
  emit("update:visible", false);
  resetForm();
};

const resetForm = () => {
  form.value = {
    tipo: "EGRESO",
    entidadId: null,
    origenEntidadId: null,
    destinoEntidadId: null,
    monto: null,
    fecha: new Date(),
    concepto: {
      titulo: "",
      detalle: "",
    },
    categoriaId: null,
    subcategoriaId: null,
    tags: [],
    divisaId: null,
  };
};

const save = async () => {
  // Basic Validation
  if (!form.value.monto || !form.value.fecha || !form.value.concepto.titulo) {
    toast.add({
      severity: "warn",
      summary: "Campos incompletos",
      detail: "Por favor complete los campos obligatorios.",
      life: 3000,
    });
    return;
  }

  if (isTransferencia.value) {
    if (!form.value.origenEntidadId || !form.value.destinoEntidadId) {
      toast.add({
        severity: "warn",
        summary: "Transferencia incompleta",
        detail: "Seleccione origen y destino.",
        life: 3000,
      });
      return;
    }
  } else {
    if (!form.value.entidadId) {
      toast.add({
        severity: "warn",
        summary: "Entidad requerida",
        detail: "Seleccione una entidad.",
        life: 3000,
      });
      return;
    }
  }

  try {
    const payload = {
      ...form.value,
      usuarioId: "TODO_USER_ID", // TODO: Get from auth store
      referencia: crypto.randomUUID(), // Or generate on backend
      origen: "MANUAL",
      estado: "COMPLETADO",
      isDeleted: false,
    };

    // Adjust payload based on type
    if (isTransferencia.value) {
      payload.entidadId = null;
    } else {
      delete payload.origenEntidadId;
      delete payload.destinoEntidadId;
    }

    await createMovimiento(payload);

    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: "Movimiento creado correctamente",
      life: 3000,
    });

    emit("saved");
    close();
  } catch (error) {
    // Error handled in useMovimientos but we can show extra info here if needed
  }
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Nuevo Movimiento"
    :style="{width: '50vw'}"
    :breakpoints="{'960px': '75vw', '641px': '90vw'}"
  >
    <div class="flex flex-col gap-4">
      <!-- Tipo -->
      <div class="flex flex-col gap-2">
        <label for="tipo">Tipo de Movimiento</label>
        <Select
          id="tipo"
          v-model="form.tipo"
          :options="movementTypes"
          optionLabel="label"
          optionValue="value"
          placeholder="Seleccione el tipo"
        />
      </div>

      <!-- Entidad / Origen-Destino -->
      <div v-if="isTransferencia" class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label for="origen">Origen</label>
          <Select
            id="origen"
            v-model="form.origenEntidadId"
            :options="entidades"
            optionLabel="nombre"
            optionValue="_id"
            placeholder="Cuenta Origen"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="destino">Destino</label>
          <Select
            id="destino"
            v-model="form.destinoEntidadId"
            :options="entidades"
            optionLabel="nombre"
            optionValue="_id"
            placeholder="Cuenta Destino"
          />
        </div>
      </div>
      <div v-else class="flex flex-col gap-2">
        <label for="entidad">Entidad / Cuenta</label>
        <Select
          id="entidad"
          v-model="form.entidadId"
          :options="entidades"
          optionLabel="nombre"
          optionValue="_id"
          placeholder="Seleccione la cuenta"
        />
      </div>

      <!-- Monto y Divisa -->
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label for="monto">Monto</label>
          <InputNumber id="monto" v-model="form.monto" mode="currency" currency="USD" locale="en-US" placeholder="0.00" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="divisa">Divisa</label>
          <Select id="divisa" v-model="form.divisaId" :options="divisas" optionLabel="codigo" optionValue="id" placeholder="Divisa" />
        </div>
      </div>

      <!-- Fecha -->
      <div class="flex flex-col gap-2">
        <label for="fecha">Fecha</label>
        <DatePicker id="fecha" v-model="form.fecha" showIcon />
      </div>

      <!-- Concepto -->
      <div class="flex flex-col gap-2">
        <label for="titulo">Título</label>
        <InputText id="titulo" v-model="form.concepto.titulo" placeholder="Ej: Compra supermercado" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="detalle">Detalle</label>
        <Textarea id="detalle" v-model="form.concepto.detalle" rows="3" autoResize />
      </div>

      <!-- Categoría y Subcategoría -->
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label for="categoria">Categoría</label>
          <Select
            id="categoria"
            v-model="form.categoriaId"
            :options="categorias"
            optionLabel="categoria"
            optionValue="_id"
            placeholder="Seleccione categoría"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label for="subcategoria">Subcategoría</label>
          <Select
            id="subcategoria"
            v-model="form.subcategoriaId"
            :options="subcategorias"
            optionLabel="subcategoria"
            optionValue="_id"
            placeholder="Seleccione subcategoría"
          />
        </div>
      </div>

      <!-- Tags -->
      <div class="flex flex-col gap-2">
        <label for="tags">Etiquetas</label>
        <AutoComplete id="tags" v-model="form.tags" multiple :typeahead="false" />
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" text @click="close" />
      <Button label="Guardar" icon="pi pi-check" @click="save" :loading="loading" />
    </template>
  </Dialog>
</template>

<style scoped>
/* Add any specific styles here */
</style>
