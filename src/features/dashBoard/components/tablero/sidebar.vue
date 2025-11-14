<script setup>
import {ref, computed} from "vue";
import {useRouter, useRoute} from "vue-router";
import {Icon} from "@iconify/vue";

import logo from "../../../../assets/img/MonyMontySinFondo3.png";
import {useAuth} from "../../../auth/logic/useAuth.js"

const {logout} = useAuth()
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
};

//abrir/cerrar el drawer desde el padre.
const open = () => {
  visible.value = true;
};
const close = () => {
  visible.value = false;
};

// Función para manejar el logout
const handleLogout = () => {
  logout()
  goTo("/")
  visible.value = false;
};

// Exponer visible y métodos para control seguro desde el componente padre
defineExpose({visible, open, close});
</script>

<template>
  <Drawer v-model:visible="visible" class="flex flex-col justify-between px-4 py-3">
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between w-full">
        <span class="inline-flex items-center">
          <img :src="logo" alt="Icono de la aplicación" class="login-logo" />
        </span>
      </div>
    </template>

    <!-- Navigation -->
    <div class="flex-1 pt-8">
      <div class="flex flex-col justify-between h-full">
        <nav class="flex-1">
          <ul class="list-none p-0 m-0">
            <li v-for="item in menuItems" :key="item.id" class="py-2">
              <Button :label="item.title" @click="goTo(item.path)" text :severity="activeItem?.id === item.id ? 'primary' : 'secondary'">
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
    <template #footer>
      <Button label="Logout" @click="handleLogout" text severity="danger" >
        <template #icon>
          <Icon icon="ion:log-out-outline" class="w-5 h-5" />
        </template>
      </Button>
    </template>
  </Drawer>
</template>

<style scoped>
/* Sección derecha */
.login-logo {
  max-width: 9rem;
}
</style>
