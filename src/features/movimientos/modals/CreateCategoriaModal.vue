<script setup>
import {ref, computed, watch} from "vue";
import {z} from "zod";
import {Icon} from "@iconify/vue";
import {useToast} from "primevue/usetoast";
import {zodResolver} from "@primevue/forms/resolvers/zod";

import {useCategorias} from "../logic/CreateCategoria";
import {useMovimientoOptions} from "../logic/OptionsMovimiento";
import {FINANCIAL_ICONS} from "../logic/MovimientoConstants";

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

// Initial Values
const getInitialValues = () => ({
  tipo: "CATEGORIA",
  categoriaId: null,
  nombre: "",
  icono: "",
  color: "",
  nota: "",
});

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      fetchOptions();
      // Reset values
      initialValues.value = getInitialValues();
      selectedType.value = "CATEGORIA";
    }
  }
);

// Initial Values
const initialValues = ref({
  tipo: "CATEGORIA",
  categoriaId: null,
  nombre: null,
  icono: null,
  color: null,
  nota: null,
});

// Zod Schema
const schema = computed(() =>
  z.object({
    ...(selectedType.value !== "CATEGORIA" && {
      categoriaId: z.string({required_error: "Debe seleccionar una categoría"}),
    }),
    nombre: z.string({required_error: "El nombre es obligatorio"}).min(2, "El nombre debe tener al menos 2 caracteres"),
    nota: z.string({required_error: "La nota es obligatoria"}).min(2, "La nota debe tener al menos 2 caracteres"),
    icono: z.string().optional(),
    color: z.string().optional(),
  })
);

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
    if (selectedType.value === "CATEGORIA") {
      await createCategoria({
        nombreCategoria: values.nombre,
        icono: values.icono,
        color: "#" + values.color,
        nota: values.nota,
      });
    } else {
      await createSubcategoria(values.categoriaId, {
        nombreSubcategoria: values.nombre,
        icono: values.icono,
        color: "#" + values.color,
        nota: values.nota,
      });
    }

    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: `${selectedType.value === "CATEGORIA" ? "Categoría" : "Subcategoría"} creada correctamente`,
      life: 3000,
    });

    emit("saved");
    close();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response?.data?.message || `No se pudo crear la ${selectedType.value === "CATEGORIA" ? "categoría" : "subcategoría"}.`,
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

      <!-- Icon Section -->
      <div class="flex flex-col gap-3">
        <label for="icono">Icono Representativo</label>
        <div class="grid grid-cols-6 gap-2 p-2 border rounded-lg max-h-56 overflow-y-auto">
          <button
            v-for="icon in FINANCIAL_ICONS"
            :key="icon"
            type="button"
            @click="$form.icono.value = icon"
            class="flex items-center justify-center p-2 rounded-lg transition-all transform active:scale-90 hover:bg-gray-200 border-2"
            :class="{
              'bg-gray-100 border-2': $form.icono?.value === icon,
              'border-transparent': $form.icono?.value !== icon,
            }"
            v-tooltip.top="icon.split(':')[1].replace('-outline', '')"
          >
            <Icon :icon="icon" class="w-6 h-6" :style="{color: $form.icono?.value === icon ? $form.color?.value : '#6b7280'}" />
          </button>
        </div>
        <InputText name="icono" class="hidden" />
        <Message v-if="$form.icono?.invalid" severity="error" size="small" variant="simple">{{ $form.icono.error?.message }}</Message>
      </div>

      <!-- Color Section -->
      <FormField v-slot="$field" name="color" class="flex flex-col gap-2">
        <label for="color">Color Representativo</label>
        <div class="flex items-center gap-4 mt-2">
          <!-- Color Picker -->
          <ColorPicker v-bind="$field.props" />

          <!-- Color Value Display -->
          <Message severity="secondary" size="small">#{{ $field.value }}</Message>
        </div>
      </FormField>

      <!-- Nota -->
      <div class="flex flex-col gap-2">
        <label for="nota">Nota</label>
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
