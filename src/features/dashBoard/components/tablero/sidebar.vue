<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const isCollapsed = ref(false);
const isMobile = ref(false);

function checkMobile() {
  isMobile.value = window.innerWidth <= 768;

  if (isMobile.value) {
    isCollapsed.value = true;
  }
}

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>


<template>
  <div class="flex h-screen bg-gray-100">

    <!-- Botón hamburguesa solo en móvil -->
    <button
      v-if="isMobile"
      @click="toggleSidebar"
      class="fixed top-4 left-4 text-orange-500 text-3xl z-[999]"
    >
      &#9776;
    </button>

    <!-- Sidebar -->
    <aside
      :class="[
        'relative overflow-hidden text-white bg-orange-500 w-60 p-5 transition-transform duration-300 ease-in-out',
        isCollapsed ? '-translate-x-64' : 'translate-x-0'
      ]"
    >

      <!-- Top blur decoration -->
      <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-[130%] h-20 rounded-full bg-black/10 blur-2xl pointer-events-none"></div>

      <!-- Bottom blur decoration -->
      <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[130%] h-20 rounded-full bg-black/10 blur-2xl pointer-events-none"></div>

      <ul class="space-y-2">
        <li class="p-3 rounded-md cursor-pointer hover:bg-black transition">
          Inicio
        </li>
        <li class="p-3 rounded-md cursor-pointer hover:bg-black transition">
          Productos
        </li>
        <li class="p-3 rounded-md cursor-pointer hover:bg-black transition">
          Clientes
        </li>
        <li class="p-3 rounded-md cursor-pointer hover:bg-black transition">
          Ajustes
        </li>
      </ul>

    </aside>

  </div>
</template>
