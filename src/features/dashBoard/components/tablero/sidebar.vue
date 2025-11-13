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
const goTo = (path) => router.push(path);
</script>

<template>
  <div class="flex flex-col justify-between px-4 py-3">
    <!-- Header -->
    <div>
      <div class="flex items-center justify-between shrink-0">
        <span class="inline-flex items-center pr-4">
          <img :src="logo" alt="Icono de la aplicación" class="login-logo" />
        </span>
        <span>
          <Button type="button" @click="closeCallback" rounded variant="outlined">
            <Icon icon="mdi:close" class="w-5 h-5" />
          </Button>
        </span>
      </div>
    </div>

    <nav class="flex-1 py-8">
      <!-- Menu Items -->
      <ul>
        <li v-for="item in menuItems" :key="item.id" class="py-2">
          <a class="flex gap-2">
            <span>
              <Icon :icon="item.icon" class="w-5 h-5" />
            </span>

            <span v-if="!isCollapsed">{{ item.title }}</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Logout -->
    <li>
      <a @click.prevent="handleLogout" class="flex gap-2" >
        <span>
          <Icon icon="ion:log-out-outline" />
        </span>
        
          <span v-if="!isCollapsed">Sign out</span>
        
      </a>
    </li>
  </div>
</template>

<style scoped>
/* Sección derecha */
.login-logo {
  max-width: 9rem;
}
</style>
