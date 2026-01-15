<script setup>
import {ref, onMounted} from "vue";
import {z} from "zod";

import {useToast} from "primevue/usetoast";
import {zodResolver} from "@primevue/forms/resolvers/zod";

import {useEntidades} from "../logic/CreateEntidad";
import {useMovimientoOptions} from "../logic/OptionsMovimiento";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:visible", "saved"]);

const toast = useToast();
const {createEntidad, loading} = useEntidades();
const {divisas, loadingOptions, fetchOptions} = useMovimientoOptions();

const entidadTipos = ref([
  {label: "Banco", value: "BANCO"},
  {label: "Efectivo", value: "EFECTIVO"},
  {label: "Billetera", value: "BILLETERA"},
]);

onMounted(() => {
  fetchOptions();
});

// Initial Values
const initialValues = ref({
  nombre: "",
  tipo: "BANCO",
  numero: "",
  saldoInicial: 0,
  divisaId: "COP",
});

// Zod Schema
const schema = z.object({
  nombre: z.string({required_error: "El nombre es obligatorio"}).min(2, "El nombre debe tener al menos 2 caracteres"),
  tipo: z.string({required_error: "El tipo es obligatorio"}),
  numero: z.string().optional(),
  saldoInicial: z.number({required_error: "El saldo inicial es obligatorio"}),
  divisaId: z.string({required_error: "La divisa es obligatoria"}),
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
    await createEntidad(values);

    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: "Entidad creada correctamente",
      life: 3000,
    });

    emit("saved");
    close();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response?.data?.message || "No se pudo crear la entidad. Intenta nuevamente.",
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
    header="Nueva Entidad / Cuenta"
    :style="{width: '40vw'}"
    :breakpoints="{'960px': '75vw', '641px': '90vw'}"
  >
    <div v-if="loadingOptions" class="flex justify-center items-center p-8">
      <ProgressSpinner />
    </div>
    <Form v-else v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="onFormSubmit" class="flex flex-col gap-4">
      <!-- Nombre -->
      <div class="flex flex-col gap-2">
        <label for="nombre">Nombre de la Entidad</label>
        <InputText name="nombre" placeholder="Ej: Banco Itau, Efectivo, Nequi" fluid />
        <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">{{ $form.nombre.error?.message }}</Message>
      </div>

      <!-- Tipo -->
      <div class="flex flex-col gap-2">
        <label for="tipo">Tipo de Entidad</label>
        <Select name="tipo" :options="entidadTipos" optionLabel="label" optionValue="value" placeholder="Seleccione el tipo" fluid />
        <Message v-if="$form.tipo?.invalid" severity="error" size="small" variant="simple">{{ $form.tipo.error?.message }}</Message>
      </div>

      <!-- Número (Opcional) -->
      <div class="flex flex-col gap-2" v-if="$form.tipo?.value !== 'EFECTIVO'">
        <label for="numero">Número de Cuenta (Opcional)</label>
        <InputText name="numero" placeholder="Ej: 6789 (Últimos dígitos)" fluid />
      </div>

      <!-- Saldo Inicial y Divisa -->
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label for="saldoInicial">Saldo Actual</label>
          <InputNumber name="saldoInicial" mode="decimal" :minFractionDigits="2" placeholder="0.00" fluid />
          <Message v-if="$form.saldoInicial?.invalid" severity="error" size="small" variant="simple">{{
            $form.saldoInicial.error?.message
          }}</Message>
        </div>
        <div class="flex flex-col gap-2">
          <label for="divisaId">Divisa</label>
          <Select name="divisaId" :options="divisas" optionLabel="label" optionValue="value" placeholder="Divisa" fluid />
          <Message v-if="$form.divisaId?.invalid" severity="error" size="small" variant="simple">{{
            $form.divisaId.error?.message
          }}</Message>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancelar" icon="pi pi-times" text @click="close" />
        <Button type="submit" label="Guardar" icon="pi pi-check" :loading="loading" />
      </div>
    </Form>
  </Dialog>
</template>

<style scoped></style>
