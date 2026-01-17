<script setup>
import {ref, computed, watch} from "vue";
import {z} from "zod";
import {Icon} from "@iconify/vue";
import {useToast} from "primevue/usetoast";
import {zodResolver} from "@primevue/forms/resolvers/zod";

import {useCategorias} from "../logic/CreateCategoria";
import {useMovimientoOptions} from "../logic/OptionsMovimiento";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:visible", "saved"]);

const toast = useToast();
const {createCategoria, createSubcategoria, loading} = useCategorias();
const {categorias, loadingOptions, fetchOptions} = useMovimientoOptions();

const typeOptions = ref([
  {label: "Categoría", value: "CATEGORIA"},
  {label: "Subcategoría", value: "SUBCATEGORIA"},
]);

const selectedType = ref("CATEGORIA");

const financialIcons = [
  "ion:cash-outline",
  "ion:card-outline",
  "ion:cart-outline",
  "ion:fast-food-outline",
  "ion:car-outline",
  "ion:home-outline",
  "ion:medkit-outline",
  "ion:school-outline",
  "ion:game-controller-outline",
  //
  "ion:paw-outline",
  "ion:gift-outline",
  "ion:barbell-outline",
  "ion:briefcase-outline",
  "ion:airplane-outline",
  "ion:water-outline",
  "ion:fitness-outline",
  "ion:phone-portrait-outline",
  "ion:library-outline",
  //
  "ion:shirt-outline",
  "ion:wine-outline",
  "ion:car-sport-outline",
  "ion:heart-outline",
  "ion:star-outline",
  "ion:flash-outline",
  "ion:wallet-outline",
  "ion:beaker-outline",
  "ion:build-outline",
  "ion:business-outline",
  //
  "ion:hammer-outline",
  "ion:leaf-outline",
  "ion:musical-notes-outline",
  "ion:restaurant-outline",
  "ion:storefront-outline",
  "ion:umbrella-outline",
  "ion:videocam-outline",
  "ion:watch-outline",
  //
  "ion:bus-outline",
  "ion:bicycle-outline",
  "ion:cafe-outline",
  "ion:camera-outline",
  "ion:construct-outline",
  "ion:cut-outline",
  "ion:flask-outline",
  "ion:ice-cream-outline",
  "ion:laptop-outline",
  //
  "ion:newspaper-outline",
  "ion:pizza-outline",
  "ion:pricetag-outline",
  "ion:rocket-outline",
  "ion:telescope-outline",
  "ion:ticket-outline",
];

watch(selectedType, (newVal) => {
  initialValues.value.tipo = newVal;
});

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      fetchOptions();
    }
  }
);

// Initial Values
const initialValues = ref({
  tipo: "CATEGORIA",
  categoriaId: null,
  nombre: "",
  icono: "ion:pricetag-outline",
  color: "#3B82F6",
  nota: "",
});

// Zod Schema
const schema = computed(() => {
  if (selectedType.value === "CATEGORIA") {
    return z.object({
      tipo: z.string(),
      nombre: z.string({required_error: "El nombre es obligatorio"}).min(2, "El nombre debe tener al menos 2 caracteres"),
      icono: z.string().optional(),
      color: z.string().optional(),
      nota: z.string().optional(),
    });
  } else {
    return z.object({
      tipo: z.string(),
      categoriaId: z.string({required_error: "Debe seleccionar una categoría"}),
      nombre: z.string({required_error: "El nombre es obligatorio"}).min(2, "El nombre debe tener al menos 2 caracteres"),
      icono: z.string().optional(),
      nota: z.string().optional(),
    });
  }
});

const resolver = computed(() => zodResolver(schema.value));

const close = () => {
  emit("update:visible", false);
};

const onFormSubmit = async ({valid, values}) => {
  if (!valid) {
    toast.add({
      severity: "warn",
      summary: "Formulario inválido",
      detail: "Por favor revise los campos marcados.",
      life: 3000,
    });
    return;
  }

  try {
    if (values.tipo === "CATEGORIA") {
      await createCategoria({
        nombreCategoria: values.nombre,
        icono: values.icono,
        color: values.color,
        nota: values.nota,
      });
    } else {
      await createSubcategoria(values.categoriaId, {
        nombreSubcategoria: values.nombre,
        icono: values.icono,
        color: values.color,
        nota: values.nota,
      });
    }

    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: `${values.tipo === "CATEGORIA" ? "Categoría" : "Subcategoría"} creada correctamente`,
      life: 3000,
    });

    emit("saved");
    fetchOptions(); // Refresh options
    close();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response?.data?.message || `No se pudo crear la ${values.tipo === "CATEGORIA" ? "categoría" : "subcategoría"}.`,
      life: 4000,
    });
  }
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Administrar Categorías"
    :style="{width: '40vw'}"
    :breakpoints="{'960px': '75vw', '641px': '90vw'}"
  >
    <div v-if="loadingOptions" class="flex justify-center items-center p-8">
      <ProgressSpinner />
    </div>
    <Form v-else v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="onFormSubmit" class="flex flex-col gap-4">
      <!-- Selector de Tipo -->
      <div class="flex flex-col gap-2">
        <label>¿Qué deseas crear?</label>
        <SelectButton
          v-model="selectedType"
          :options="typeOptions"
          optionLabel="label"
          optionValue="value"
          class="w-full"
          @change="$form.tipo.value = $event.value"
        />
        <InputText name="tipo" class="hidden" />
      </div>

      <!-- Selección de Categoría Padre (Solo para Subcategoría) -->
      <div v-if="selectedType === 'SUBCATEGORIA'" class="flex flex-col gap-2">
        <label for="categoriaId">Categoría Principal</label>
        <Select
          name="categoriaId"
          :options="categorias"
          optionLabel="label"
          optionValue="value"
          placeholder="Seleccione una categoría"
          filter
          fluid
        />
        <Message v-if="$form.categoriaId?.invalid" severity="error" size="small" variant="simple">{{
          $form.categoriaId.error?.message
        }}</Message>
      </div>

      <!-- Nombre -->
      <div class="flex flex-col gap-2">
        <label for="nombre">Nombre de la {{ selectedType === "CATEGORIA" ? "Categoría" : "Subcategoría" }}</label>
        <InputText name="nombre" :placeholder="`Ej: ${selectedType === 'CATEGORIA' ? 'Alimentación' : 'Restaurantes'}`" fluid />
        <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">{{ $form.nombre.error?.message }}</Message>
      </div>

      <!-- Icono y Color -->
      <div class="flex flex-col gap-4">
        <label>Selecciona un Icono</label>
        <div
          class="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 border rounded-lg border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-800/50"
        >
          <button
            v-for="icon in financialIcons"
            :key="icon"
            type="button"
            @click="$form.icono.value = icon"
            class="flex items-center justify-center p-2 rounded-md transition-all hover:bg-primary-100 dark:hover:bg-primary-900/30"
            :class="{
              'bg-primary-500 text-white hover:bg-primary-600': $form.icono?.value === icon,
              'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300': $form.icono?.value !== icon,
            }"
            v-tooltip="icon.split(':')[1].replace('-outline', '')"
          >
            <Icon :icon="icon" class="w-6 h-6" />
          </button>
        </div>
        <InputText name="icono" class="hidden" />

        <div v-if="selectedType === 'CATEGORIA'" class="flex flex-col gap-2">
          <label for="color">Color de Identificación</label>
          <div class="flex items-center gap-4 p-2 border rounded-lg border-gray-200 dark:border-gray-700">
            <input
              type="color"
              :value="$form.color?.value || '#3B82F6'"
              @input="$form.color.value = $event.target.value"
              class="h-10 w-12 border-none bg-transparent cursor-pointer rounded overflow-hidden"
            />
            <InputText name="color" placeholder="#3B82F6" class="flex-1" />
          </div>
        </div>
      </div>

      <!-- Nota -->
      <div class="flex flex-col gap-2">
        <label for="nota">Nota (Opcional)</label>
        <Textarea name="nota" rows="2" placeholder="Agrega una descripción..." fluid />
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancelar" icon="pi pi-times" text @click="close" />
        <Button type="submit" label="Guardar" icon="pi pi-check" :loading="loading" />
      </div>
    </Form>
  </Dialog>
</template>

<style scoped></style>
