<script setup>
import {useToast} from "primevue/usetoast";
import {onMounted, ref} from "vue";
import {Icon} from "@iconify/vue";

import {userData} from "../../logic/user.js";

// Estados reactivos para mejor control
const toast = useToast();
const {cargarUsuario} = userData();
const isLoading = ref(true);
const usuario = ref(null);

onMounted(async () => {
  try {
    const result = await cargarUsuario();

    if (result.success) {
      usuario.value = result.data;
      isLoading.value = false;
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: result.error || "Error al cargar usuario",
        life: 4000,
      });
    }
  } catch {
    toast.add({
      severity: "error",
      summary: "Error de conexión",
      detail: "Inténtalo de nuevo cargar el Usuario.",
      life: 4000,
    });
  }
});
</script>

<template>
  <header class="flex items-center justify-between px-4 py-2 lg:px-6 xl:px-8">
    <div>
      <Button @click="$emit('open-drawer')" text>
        <Icon icon="ion:menu-outline" class="w-5 h-5" />
      </Button>
    </div>
    <div class="flex-1 flex items-center justify-end">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex items-center gap-3">
        <ProgressSpinner class="w-5 h-5" />
        <Message severity="contrast" variant="simple"> Cargando usuario... </Message>
      </div>

      <!-- User profile -->
      <div v-else class="flex items-center gap-4 sm:flex-col-reverse sm:gap-2 md:flex-row">
        <div class="flex flex-col gap-1 text-right sm:text-center">
          <h3 class="m-0 text-lg sm:text-base">
            {{ usuario?.nombre || "Usuario" }}
          </h3>
          <Badge :label="usuario?.plan" />
        </div>

        <Avatar :label="usuario?.nombre[0]" :image="usuario?.avatar" icon="pi pi-user" size="large" shape="circle" />
      </div>
    </div>
  </header>
</template>
