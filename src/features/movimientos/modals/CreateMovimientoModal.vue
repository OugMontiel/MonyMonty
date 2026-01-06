<script setup>
import {ref, watch, onMounted} from "vue";
import {z} from "zod";

import {useToast} from "primevue/usetoast";
import {zodResolver} from "@primevue/forms/resolvers/zod";

import {useMovimientos} from "../logic/CreateMovimiento";
import {useMovimientoOptions} from "../logic/OptionsMovimiento";

const toast = useToast();
const {createMovimiento, loading} = useMovimientos();
const {movementTypes, entidades, categorias, divisas, loadingOptions, fetchOptions} = useMovimientoOptions();

const subcategories = ref([]);

onMounted(() => {
  fetchOptions();
});

const onCategoryChange = (e) => {
  const selectedCategoryId = e.value;
  const selectedCategory = categorias.value.find((c) => c._id === selectedCategoryId);
  subcategories.value = selectedCategory ? selectedCategory.subcategorias : [];
};

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:visible", "saved"]);

// Initial Values
const initialValues = ref({
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
});

// Zod Schema
const schema = z
  .object({
    tipo: z.string({required_error: "El tipo de movimiento es obligatorio"}),
    monto: z.number({invalid_type_error: "El monto es obligatorio"}).min(0.01, "El monto debe ser mayor a 0"),
    fecha: z.date({required_error: "La fecha es obligatoria"}),
    concepto: z.object({
      titulo: z.string().optional(),
      detalle: z.string().optional(),
    }),
    categoriaId: z.string().optional().nullable(),
    subcategoriaId: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    divisaId: z.string().nullable(),
    entidadId: z.string().optional().nullable(),
    origenEntidadId: z.string().optional().nullable(),
    destinoEntidadId: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === "TRANSFERENCIA") {
      if (!data.origenEntidadId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La cuenta de origen es obligatoria",
          path: ["origenEntidadId"],
        });
      }
      if (!data.destinoEntidadId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La cuenta de destino es obligatoria",
          path: ["destinoEntidadId"],
        });
      }
      if (data.origenEntidadId && data.destinoEntidadId && data.origenEntidadId === data.destinoEntidadId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La cuenta de origen y destino no pueden ser iguales",
          path: ["destinoEntidadId"],
        });
      }
    } else {
      // Validaciones para NO TRANSFERENCIA
      if (!data.entidadId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La cuenta es obligatoria",
          path: ["entidadId"],
        });
      }
      if (!data.categoriaId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La categoría es obligatoria",
          path: ["categoriaId"],
        });
      }
      if (!data.subcategoriaId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La subcategoría es obligatoria",
          path: ["subcategoriaId"],
        });
      }
    }
  });

const resolver = zodResolver(schema);

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
    const payload = {
      ...values,
      // usuarioId: "TODO_USER_ID", // TODO: Se Gestiona en backend
      // referencia: crypto.randomUUID(), // TODO: Se Gestiona en backend
      origen: "MANUAL",
      estado: "COMPLETADO",
      // isDeleted: false, // TODO: Add if needed
    };

    // Clean up payload based on type
    if (values.tipo === "TRANSFERENCIA") {
      payload.transferencia = {
        origenEntidadId: values.origenEntidadId,
        destinoEntidadId: values.destinoEntidadId,
      };
      delete payload.entidadId;
      delete payload.origenEntidadId;
      delete payload.destinoEntidadId;
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
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response?.data?.message || "No se pudo crear el movimiento. Intenta nuevamente.",
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
    header="Nuevo Movimiento"
    :style="{width: '50vw'}"
    :breakpoints="{'960px': '75vw', '641px': '90vw'}"
  >
    <div v-if="loadingOptions" class="flex justify-center items-center p-8">
      <ProgressSpinner />
    </div>
    <Form
      v-else
      ref="formRef"
      v-slot="$form"
      :resolver="resolver"
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="flex flex-col gap-4"
    >
      <!-- Tipo -->
      <div class="flex flex-col gap-2">
        <label for="tipo">Tipo de Movimiento</label>
        <Select name="tipo" :options="movementTypes" optionLabel="label" optionValue="value" placeholder="Seleccione el tipo" fluid />
      </div>

      <!-- Entidad / Origen-Destino -->
      <div v-if="$form.tipo?.value === 'TRANSFERENCIA'" class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label for="origen">Origen</label>
          <Select name="origenEntidadId" :options="entidades" optionLabel="label" optionValue="value" placeholder="Cuenta Origen" fluid />
          <Message v-if="$form.origenEntidadId?.invalid" severity="error" size="small" variant="simple">{{
            $form.origenEntidadId.error?.message
          }}</Message>
        </div>
        <div class="flex flex-col gap-2">
          <label for="destino">Destino</label>
          <Select name="destinoEntidadId" :options="entidades" optionLabel="label" optionValue="value" placeholder="Cuenta Destino" fluid />
          <Message v-if="$form.destinoEntidadId?.invalid" severity="error" size="small" variant="simple">{{
            $form.destinoEntidadId.error?.message
          }}</Message>
        </div>
      </div>
      <div v-else class="flex flex-col gap-2">
        <label for="entidad">Entidad / Cuenta</label>
        <Select name="entidadId" :options="entidades" optionLabel="label" optionValue="value" placeholder="Seleccione la cuenta" fluid />
        <Message v-if="$form.entidadId?.invalid" severity="error" size="small" variant="simple">{{
          $form.entidadId.error?.message
        }}</Message>
      </div>

      <!-- Monto y Divisa -->
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label for="monto">Monto</label>
          <InputNumber name="monto" mode="currency" currency="USD" locale="en-US" placeholder="0.00" fluid />
          <Message v-if="$form.monto?.invalid" severity="error" size="small" variant="simple">{{ $form.monto.error?.message }}</Message>
        </div>
        <div class="flex flex-col gap-2">
          <label for="divisa">Divisa</label>
          <Select name="divisaId" :options="divisas" optionLabel="label" optionValue="value" placeholder="Divisa" fluid />
        </div>
      </div>

      <!-- Fecha -->
      <div class="flex flex-col gap-2">
        <label for="fecha">Fecha</label>
        <DatePicker name="fecha" showIcon fluid />
        <Message v-if="$form.fecha?.invalid" severity="error" size="small" variant="simple">{{ $form.fecha.error?.message }}</Message>
      </div>

      <!-- Concepto -->
      <div class="flex flex-col gap-2">
        <label for="titulo">Título</label>
        <InputText name="concepto.titulo" placeholder="Ej: Compra supermercado" fluid />
        <Message v-if="$form.concepto?.titulo?.invalid" severity="error" size="small" variant="simple">{{
          $form.concepto.titulo.error?.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="detalle">Detalle</label>
        <Textarea name="concepto.detalle" rows="3" autoResize fluid />
      </div>

      <!-- Categoría y Subcategoría -->
      <div v-if="$form.tipo?.value !== 'TRANSFERENCIA'" class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label for="categoria">Categoría</label>
          <Select
            name="categoriaId"
            :options="categorias"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione categoría"
            fluid
            @change="onCategoryChange"
          />
          <Message v-if="$form.categoriaId?.invalid" severity="error" size="small" variant="simple">{{
            $form.categoriaId.error?.message
          }}</Message>
        </div>
        <div class="flex flex-col gap-2">
          <label for="subcategoria">Subcategoría</label>
          <Select
            name="subcategoriaId"
            :options="subcategories"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione subcategoría"
            fluid
          />
          <Message v-if="$form.subcategoriaId?.invalid" severity="error" size="small" variant="simple">{{
            $form.subcategoriaId.error?.message
          }}</Message>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="$form.tipo?.value !== 'TRANSFERENCIA'" class="flex flex-col gap-2">
        <label for="tags">Etiquetas</label>
        <AutoComplete name="tags" multiple :typeahead="false" fluid />
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancelar" icon="pi pi-times" text @click="close" />
        <Button type="submit" label="Guardar" icon="pi pi-check" :loading="loading" />
      </div>
    </Form>
  </Dialog>
</template>

<style scoped>
/* Add any specific styles here */
</style>
