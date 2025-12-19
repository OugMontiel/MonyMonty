<script setup>
import { useToast } from "primevue/usetoast";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

import logo from "../../../../assets/img/MonyMontySinFondo3.png";
import { userData } from "../../logic/user.js";

// Estados reactivos para mejor control
const toast = useToast();
<<<<<<< HEAD
const { cargarUsuario } = userData();
const isLoading = ref(true);
const usuario = ref(null);
=======
const {cargarUsuario, usuario: cachedUsuario} = userData();
const isLoading = ref(false);
const usuario = ref(cachedUsuario ? cachedUsuario.value : null);
>>>>>>> origin/feature/DiseñoDashBoart

// Obtén la ruta ACTUAL
const route = useRoute();

const router = useRouter();

const currentTitle = ref("Tablero");

// Define los títulos por ruta (igual que tu drawer)
const menuItems = [
  { title: "Dashboard ", path: "/tablero", icon: "ion:grid-outline" },
  { title: "customers", path: "/customers", icon: "ion:people-outline" },
  { title: "messages", path: "/messages", icon: "ion:chatbubble-outline" },
  { title: "help", path: "/help", icon: "ion:help-outline" },
  { title: "settings", path: "/settings", icon: "ion:settings-outline" },
];
watch(
  () => route.path,
  (newPath) => {
    const item = menuItems.find(i => newPath.startsWith(i.path));
    currentTitle.value = item ? item.title : "Dashboard";
  }

);

onMounted(async () => {
  // Si ya hay datos del usuario
  if (usuario.value) {
    return;
  }

  // Si no hay datos, cargarlos
  isLoading.value = true;
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
  <header class="flex items-center justify-between px-6 py-2 lg:px-6 xl:px-8">
    <div class="flex items-center gap-4">
      <Icon icon="ion:menu-outline" class="w-8 h-8 cursor-pointer" @click="$emit('open-drawer')" />

      <button @click="router.push('/tablero')"
        class="cursor-pointer hover:opacity-85 active:scale-95 transition-all duration-150 focus:outline-none "
        aria-label="Ir al tablero">
        <img :src="logo" alt="Icono de la aplicación" class="login-logo ml-4" />
      </button>
    </div>

    <h1 class="absolute left-1/2 transform -translate-x-1/2 font-semibold text-2xl whitespace-nowrap">
      {{ currentTitle }}
    </h1>
    <div class="flex-1 flex items-center justify-end">
      
      <div v-if="isLoading" class="flex items-center gap-3">
        <ProgressSpinner style="width: 50px; height: 50px" />
        <Message severity="contrast" variant="simple"> Cargando usuario... </Message>
      </div>


      <div v-else class="flex items-center gap-4 sm:flex-col-reverse sm:gap-2 md:flex-row">
        <Badge :label="usuario?.plan" />
        <div class="flex flex-col gap-1 text-right sm:text-center">
          <h3 class="m-0 text-lg sm:text-base">
<<<<<<< HEAD
            {{ usuario?.nombre || "Usuario1" }}
=======
            {{ usuario?.nombre }}
>>>>>>> origin/feature/DiseñoDashBoart
          </h3>

        </div>

        <!--  
        <Avatar :label="usuario?.nombre[0]" :image="usuario?.avatar" icon="pi pi-user" size="large" shape="circle" />

       -->
      </div>
    </div>
  </header>
</template>

<style>
.login-logo {
  max-width: 7rem;
}
</style>