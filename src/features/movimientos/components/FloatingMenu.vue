<script setup>
import {ref} from "vue";
import {Icon} from "@iconify/vue";
import CreateMovimientoModal from "../modals/CreateMovimientoModal.vue";
import CreateEntidadModal from "../modals/CreateEntidadModal.vue";

import {useToast} from "primevue/usetoast";

const toast = useToast();

const isModalCreateMovimientoOpen = ref(false);
const isModalCreateEntidadOpen = ref(false);

// Items for SpeedDial
const items = ref([
  {
    label: "Nuevo Movimiento",
    icon: "ion:cash-outline",
    command: () => {
      isModalCreateMovimientoOpen.value = true;
    },
  },
  {
    label: "Nueva Cuenta",
    icon: "ion:wallet-outline",
    command: () => {
      isModalCreateEntidadOpen.value = true;
    },
  },
  {
    label: "Nueva Categoría",
    icon: "ion:pricetag-outline",
    command: () => {
      toast.add({
        severity: "info",
        summary: "Add",
        detail: "Data Added",
        life: 3000,
      });
    },
  },
  {
    label: "Nueva Sub Categoría",
    icon: "ion:pricetags-outline",
    command: () => {
      toast.add({
        severity: "error",
        summary: "Delete",
        detail: "Data Deleted",
        life: 3000,
      });
    },
  },
]);
</script>

<template>
  <div class="fixed bottom-8 right-8 z-50">
    <SpeedDial
      :model="items"
      :radius="120"
      type="quarter-circle"
      direction="up-left"
      :style="{position: 'absolute', bottom: '0', right: '0'}"
      :tooltipOptions="{position: 'left'}"
    >
      <template #item="{item, onClick}">
        <a
          href="#"
          role="menuitem"
          @click.prevent="onClick"
          v-tooltip.left="item.label"
        >
          <Icon :icon="item.icon" class="w-6 h-6" />
        </a>
      </template>
    </SpeedDial>

    <CreateMovimientoModal v-model:visible="isModalCreateMovimientoOpen" />
    <CreateEntidadModal v-model:visible="isModalCreateEntidadOpen"/>
  </div>
</template>

<style scoped></style>
