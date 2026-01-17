<script setup>
import {ref, computed, watch} from "vue";
import {z} from "zod";
import {Icon} from "@iconify/vue";
import {useToast} from "primevue/usetoast";
import {zodResolver} from "@primevue/forms/resolvers/zod";

import {useCategorias} from "../logic/CreateCategoria";
import {useMovimientoOptions} from "../logic/OptionsMovimiento";
import {FINANCIAL_ICONS, COLOR_PALETTE} from "../logic/MovimientoConstants";

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

      <!-- Icono y Color -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 rounded-xl">
        <!-- Color Section -->
        <FormField v-if="selectedType === 'CATEGORIA'" name="color" v-slot="$field">
          <div class="flex flex-col gap-3">
            <label class="font-semibold text-sm text-gray-700">Color de Identidad</label>

            <!-- Palette & Picker Container -->
            <div class="flex flex-wrap gap-3 items-center">
              <!-- Predefined Colors -->
              <button
                v-for="c in COLOR_PALETTE"
                :key="c"
                type="button"
                @click="$field.value = c"
                class="w-8 h-8 rounded-full shadow-sm transition-all duration-300 focus:outline-none relative flex items-center justify-center border border-gray-100"
                :style="{backgroundColor: c}"
                :class="[
                  $field.value === c ? 'scale-110 ring-2 ring-offset-2 ring-blue-500 opacity-100 z-10' : '',
                  $field.value && $field.value !== c
                    ? 'opacity-40 hover:opacity-100 scale-90 hover:scale-100'
                    : 'opacity-100 hover:scale-110',
                ]"
              >
                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 scale-50"
                  enter-to-class="opacity-100 scale-100"
                >
                  <i v-if="$field.value === c" class="pi pi-check text-white text-xs drop-shadow-md pointer-events-none"></i>
                </Transition>
              </button>

              <!-- Custom Picker Circle -->
              <div
                class="w-8 h-8 rounded-full shadow-sm transition-all duration-300 relative flex items-center justify-center border border-gray-200 overflow-hidden bg-white"
                :class="[
                  $field.value && !COLOR_PALETTE.includes($field.value)
                    ? 'scale-110 ring-2 ring-offset-2 ring-blue-500 opacity-100 z-10'
                    : '',
                  $field.value && COLOR_PALETTE.includes($field.value)
                    ? 'opacity-40 hover:opacity-100 scale-90 hover:scale-100'
                    : 'opacity-100 hover:scale-110',
                ]"
              >
                <!-- Background color preview for custom color -->
                <div
                  class="absolute inset-0 w-full h-full"
                  :style="{backgroundColor: $field.value && !COLOR_PALETTE.includes($field.value) ? $field.value : '#ffffff'}"
                ></div>

                <!-- Icon -->
                <i
                  v-if="!$field.value || COLOR_PALETTE.includes($field.value)"
                  class="pi pi-palette text-gray-400 text-xs relative z-10 pointer-events-none"
                ></i>
                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 scale-50"
                  enter-to-class="opacity-100 scale-100"
                >
                  <i
                    v-if="$field.value && !COLOR_PALETTE.includes($field.value)"
                    class="pi pi-check text-white text-xs drop-shadow-md relative z-10 pointer-events-none"
                  ></i>
                </Transition>

                <!-- The Actual Picker - Invisible but clickable -->
                <ColorPicker v-model="$field.value" format="hex" class="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
              </div>
            </div>

            <!-- Hex Input Sync -->
            <div class="flex items-center gap-2 mt-1 px-1">
              <span class="text-xs text-gray-400 font-mono tracking-wider">HEX:</span>
              <InputText
                v-model="$field.value"
                placeholder="#000000"
                class="!bg-transparent !border-0 !border-b !border-gray-200 !rounded-none !px-0 !py-0 font-mono text-sm w-24 focus:!border-blue-500 focus:!ring-0 transition-colors placeholder:text-gray-300 text-gray-600"
              />
            </div>
          </div>
        </FormField>

        <!-- Icon Section -->
        <FormField name="icono" v-slot="$field">
          <div class="flex flex-col gap-3">
            <label class="text-sm font-semibold flex items-center gap-2">
              <Icon icon="ion:happy-outline" class="text-primary-500" />
              Icono Representativo
            </label>
            <div class="grid grid-cols-6 gap-2 p-2 border rounded-lg max-h-56 overflow-y-auto">
              >
              <button
                v-for="icon in FINANCIAL_ICONS"
                :key="icon"
                type="button"
                @click="$field.value = icon"
                class="flex items-center justify-center p-2 rounded-lg transition-all transform active:scale-90 hover:bg-primary-50"
                :class="{
                  'bg-primary-500 shadow-md shadow-primary-200 pointer-events-none': $field.value === icon,
                  '': $field.value !== icon,
                }"
                v-tooltip.top="icon.split(':')[1].replace('-outline', '')"
              >
                <Icon :icon="icon" class="w-6 h-6" />
              </button>
            </div>
          </div>
        </FormField>
      </div>

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
