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
      class:
        "sticky top-0 h-screen overflow-y-auto bg-white border-r border-surface-200 dark:border-surface-700 flex flex-col justify-between px-4 py-3 w-64 z-20",
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
  <!-- Desktop Sidebar -->
  <Transition name="layout-sidebar">
    <div
      v-if="isDesktop && visible"
      class="sticky top-0 h-screen overflow-y-auto bg-white border-r border-surface-200 dark:border-surface-700 flex flex-col justify-between px-4 py-3 w-64 z-20"
    >
      <div class="flex flex-col h-full w-full overflow-hidden">
        <!-- Logo -->
        <div class="flex items-center justify-between w-full mb-6">
          <span class="inline-flex items-center">
            <img :src="logo" alt="Icono de la aplicación" class="login-logo" />
          </span>
        </div>

        <!-- Navigation Menu -->
        <div class="flex-1">
          <nav class="flex-1">
            <ul class="list-none p-0 m-0">
              <li v-for="item in menuItems" :key="item.id" class="py-2">
                <Button
                  :label="item.title"
                  @click="goTo(item.path)"
                  text
                  :severity="activeItem?.id === item.id ? 'primary' : 'secondary'"
                  class="w-full justify-start whitespace-nowrap"
                >
                  <template #icon>
                    <Icon :icon="item.icon" class="w-5 h-5 min-w-5 mr-3" />
                  </template>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Mobile Drawer -->
  <Drawer v-if="!isDesktop" v-model:visible="visible" class="flex flex-col justify-between px-4 py-3">
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between w-full">
        <span class="inline-flex items-center">
          <img :src="logo" alt="Icono de la aplicación" class="login-logo" />
        </span>
      </div>
    </template>

    <!-- Navigation Menu -->
    <div class="flex-1 pt-4">
      <nav class="flex-1">
        <ul class="list-none p-0 m-0">
          <li v-for="item in menuItems" :key="item.id" class="py-2">
            <Button
              :label="item.title"
              @click="goTo(item.path)"
              text
              :severity="activeItem?.id === item.id ? 'primary' : 'secondary'"
              class="w-full justify-start whitespace-nowrap"
            >
              <template #icon>
                <Icon :icon="item.icon" class="w-5 h-5 min-w-5 mr-3" />
              </template>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  </Drawer>
</template>

<style scoped>
.login-logo {
  max-width: 9rem;
}

/* Sidebar Transition */
.layout-sidebar-enter-active,
.layout-sidebar-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.layout-sidebar-enter-from,
.layout-sidebar-leave-to {
  width: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  opacity: 0;
  border-right: none !important;
}

.layout-sidebar-enter-to,
.layout-sidebar-leave-from {
  width: 16rem; /* w-64 */
  opacity: 1;
}
</style>
