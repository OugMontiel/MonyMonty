<script setup>
import {useToast} from "primevue/usetoast";
import {computed, onMounted, ref} from "vue";
import {Icon} from "@iconify/vue";

import {userData} from "../../logic/user.js";

// Estados reactivos para mejor control
const toast = useToast();
const {cargarUsuario, usuario: cachedUsuario} = userData();
const isLoading = ref(false);
const usuario = ref(cachedUsuario ? cachedUsuario.value : null);

const displayName = computed(() => {
  if (!usuario.value) return "";
  const nombre = usuario.value.nombre;
  const apellido = usuario.value.apellido;
  return `${nombre} ${apellido}`.trim();
});

const planLabel = computed(() => usuario.value?.planId || "Plan sin asignar");

const avatarLabel = computed(() => usuario.value?.nombre?.[0]?.toUpperCase());

const planSeverity = computed(() => {
  const plan = (usuario.value?.planId || "").toString().toLowerCase();
  if (plan.includes("pro") || plan.includes("premium")) return "success";
  if (plan.includes("free") || plan.includes("gratuito")) return "info";
  return "secondary";
});

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
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <header
    class="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-sm"
  >
    <div class="flex items-center justify-between gap-4 px-4 py-3 lg:px-6 xl:px-8">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 p-2 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label="Abrir menú lateral"
        @click="$emit('open-drawer')"
      >
        <Icon icon="ion:menu-outline" class="w-6 h-6" />
      </button>

      <div class="flex flex-1 items-center justify-end">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex items-center gap-3">
          <Skeleton shape="circle" size="3.25rem" class="shadow" />
          <div class="flex flex-col gap-2 text-right">
            <Skeleton width="9rem" height="0.85rem" />
            <Skeleton width="6rem" height="0.7rem" />
          </div>
        </div>

        <!-- User profile -->
        <div
          v-else
          class="inline-flex items-center gap-4 rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm sm:flex-col sm:items-end sm:px-3 sm:py-2 md:flex-row"
        >
          <div class="text-right sm:text-right">
            <p class="m-0 text-xs uppercase tracking-[0.12em] text-slate-400">Tu cuenta</p>
            <h3 class="m-0 text-lg font-semibold text-slate-900 sm:text-base">{{ displayName }}</h3>
            <div class="mt-1 flex items-center justify-end gap-2">
              <Tag
                :value="planLabel"
                :severity="planSeverity"
                class="text-[11px] py-0.5 px-2 font-medium"
                rounded
              />
              <span class="text-[11px] text-slate-500" v-if="usuario?.correo">{{ usuario.correo }}</span>
            </div>
          </div>

          <Avatar
            :label="avatarLabel"
            :image="usuario?.avatar"
            icon="pi pi-user"
            size="large"
            shape="circle"
            class="shadow-md ring-2 ring-primary/15 ring-offset-2"
          />
        </div>
      </div>
    </div>
  </header>
</template>
