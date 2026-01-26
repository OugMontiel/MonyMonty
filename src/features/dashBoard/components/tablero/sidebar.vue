<script setup>
import {ref, computed, onMounted, onUnmounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import {Icon} from "@iconify/vue";
import Drawer from "primevue/drawer";

import logo from "../../../../assets/img/MonyMontySinFondo3.png";

const router = useRouter();
const route = useRoute();
const visible = ref(false);
const isDesktop = ref(false);

const menuItems = [
  {
    id: "dashboard",
    icon: "ion:grid-outline",
    title: "Dashboard",
    path: "/tablero",
  },
  {
    id: "customers",
    icon: "ion:people-outline",
    title: "Customers",
    path: "/customers",
  },
  {
    id: "messages",
    icon: "ion:chatbubble-outline",
    title: "Messages",
    path: "/messages",
  },
  {
    id: "help",
    icon: "ion:help-outline",
    title: "Help",
    path: "/help",
  },
  {
    id: "settings",
    icon: "ion:settings-outline",
    title: "Settings",
    path: "/settings",
  },
  {
    id: "password",
    icon: "ion:lock-closed-outline",
    title: "Password",
    path: "/password",
  },
];

// Ruta activa
const activeItem = computed(() => menuItems.find((item) => route.path.startsWith(item.path)));

// Redirecciones
const goTo = (path) => {
  router.push(path);
};

// Control de responsive
const checkScreenSize = () => {
  isDesktop.value = window.matchMedia("(min-width: 1024px)").matches;
};

// Determinar el componente contenedor (Drawer para mobile, div para desktop)
const ContainerComponent = computed(() => (isDesktop.value ? "div" : Drawer));

// Propiedades dinámicas para el contenedor
const containerProps = computed(() => {
  if (isDesktop.value) {
    return {
      class: "h-auto min-h-full bg-white border-r border-surface-200 dark:border-surface-700 flex flex-col justify-between px-4 py-3 w-64",
    };
  }
  return {
    visible: visible.value,
    "onUpdate:visible": (val) => (visible.value = val),
    class: "flex flex-col justify-between px-4 py-3",
  };
});

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});

defineExpose({visible});
</script>

<template>
  <!-- Renderizar condicionalmente solo si es desktop O si es mobile y está visible (Drawer maneja su propia visibilidad con v-model) -->
  <!-- Nota: Drawer usa 'visible' prop, div usa v-if explícito si queremos ocultarlo, pero aquí el div desktop siempre está presente si isDesktop && visible es true desde el padre, pero el padre controla el layout.
        En Desktop: Sidebar siempre visible (Static).
        En Mobile: Sidebar controlado por visible. -->

  <component :is="ContainerComponent" v-bind="containerProps" v-if="isDesktop ? visible : true">
    <!-- Header Shared Code -->
    <template #header v-if="!isDesktop">
      <div class="flex items-center justify-between w-full">
        <span class="inline-flex items-center">
          <img :src="logo" alt="Icono de la aplicación" class="login-logo" />
        </span>
      </div>
    </template>

    <!-- Content Wrapper -->
    <div class="flex flex-col h-full w-full">
      <!-- Logo for Desktop (inside flow) -->
      <div v-if="isDesktop" class="flex items-center justify-between w-full mb-6">
        <span class="inline-flex items-center">
          <img :src="logo" alt="Icono de la aplicación" class="login-logo" />
        </span>
      </div>

      <!-- Navigation Menu (The 'const' logic) -->
      <div class="flex-1">
        <nav class="flex-1">
          <ul class="list-none p-0 m-0">
            <li v-for="item in menuItems" :key="item.id" class="py-2">
              <Button
                :label="item.title"
                @click="goTo(item.path)"
                text
                :severity="activeItem?.id === item.id ? 'primary' : 'secondary'"
                class="w-full justify-start"
              >
                <template #icon>
                  <Icon :icon="item.icon" class="w-5 h-5" />
                </template>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </component>
</template>

<style scoped>
.login-logo {
  max-width: 9rem;
}
</style>
