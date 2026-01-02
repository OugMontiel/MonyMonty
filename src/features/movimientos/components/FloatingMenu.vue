<script setup>
import {ref} from "vue";
import {Icon} from "@iconify/vue";
import {useMovimientos} from "../logic/useMovimientos";

import {useToast} from "primevue/usetoast";
import {useRouter} from "vue-router";

const toast = useToast();
const router = useRouter();

// Logic hook (prepared for future use)
const {createMovimiento} = useMovimientos();

// Items for SpeedDial
const items = ref([
  {
    label: "Nuevo Movimiento",
    icon: "ion:cash-outline",
    command: () => {
      console.log("Crear movimiento clicked");
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
    label: "Nueva Cuenta",
    icon: "ion:wallet-outline",
    command: () => {
      toast.add({
        severity: "success",
        summary: "Update",
        detail: "Data Updated",
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
  </div>
</template>

<style scoped></style>
