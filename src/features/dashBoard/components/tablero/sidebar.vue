<script setup>
import {ref, computed} from "vue";
import {useRouter, useRoute} from "vue-router";
import {Icon} from "@iconify/vue";

import logo from "../../../../assets/img/MonyMontySinFondo3.png";

const router = useRouter();
const route = useRoute();
const visible = ref(false);

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
  visible.value = false;
};

// Función para cerrar el drawer
const closeDrawer = () => {
  visible.value = false;
};

// Función para manejar el logout
const handleLogout = () => {
  // Aquí va tu lógica de logout
  console.log("Logging out...");
  visible.value = false;
};

// Exponer visible para que pueda ser controlado desde el componente padre
defineExpose({visible});
</script>

<template>
  <Drawer v-model:visible="visible" class="flex flex-col justify-between px-4 py-3">
    <!-- Header -->
    <div>
      <div class="flex items-center justify-between w-full">
        <span class="inline-flex items-center">
          <img :src="logo" alt="Icono de la aplicación" class="login-logo" />
        </span>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex-1 pt-8">
      <div class="flex flex-col justify-between h-full">
        <nav class="flex-1">
          <ul class="list-none p-0 m-0">
            <li v-for="item in menuItems" :key="item.id" class="py-2">
              <Button
                :label="item.title"
                @click="goTo(item.path)"
                text
                :severity="activeItem?.id === item.id ? 'primary' : 'secondary'"
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

    <!-- Logout Button -->
    <div>
      <Button label="Logout" @click="handleLogout" text severity="danger" class="w-full flex-auto">
        <template #icon>
          <Icon icon="ion:log-out-outline" class="w-5 h-5" />
        </template>
      </Button>
    </div>
  </Drawer>
</template>

<style scoped>
/* Sección derecha */
.login-logo {
  max-width: 9rem;
}
</style>
