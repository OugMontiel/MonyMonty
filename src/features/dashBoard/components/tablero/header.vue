<script setup>
import {useToast} from "primevue/usetoast";
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {Icon} from "@iconify/vue";

import {userData} from "../../logic/user.js";
import {useAuth} from "../../../auth/logic/useAuth.js";

// Estados reactivos para mejor control
const toast = useToast();
const router = useRouter();
const {logout} = useAuth();
const {cargarUsuario, usuario: cachedUsuario} = userData();
const isLoading = ref(false);
const usuario = ref(cachedUsuario ? cachedUsuario.value : null);
const userMenuPopover = ref();

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

// Toggle del popover
const toggleUserMenu = (event) => {
  userMenuPopover.value.toggle(event);
};

// Handlers para las acciones del menú
const handleMenuAction = (action) => {
  userMenuPopover.value.hide();

  toast.add({
    severity: "info",
    summary: "En Desarrollo",
    detail: `La funcionalidad "${action}" está en desarrollo`,
    life: 3000,
  });
};

// Función para manejar el logout (movida desde sidebar.vue)
const handleLogout = () => {
  userMenuPopover.value.hide();
  logout();
  router.push("/");
};

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
  <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
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

        <!-- User profile - Clickable -->
        <button
          v-else
          type="button"
          class="inline-flex items-center gap-4 rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:bg-white sm:items-center sm:px-3 sm:py-2 md:flex-row cursor-pointer"
          @click="toggleUserMenu"
          aria-label="Abrir menú de usuario"
        >
          <div class="text-right sm:text-right">
            <p class="m-0 text-xs uppercase tracking-[0.12em] text-slate-400">Tu cuenta</p>
            <h3 class="m-0 text-lg font-semibold text-slate-900 sm:text-base">{{ displayName }}</h3>
            <div class="mt-1 flex items-center justify-end gap-2">
              <Tag :value="planLabel" :severity="planSeverity" class="text-[11px] py-0.5 px-2 font-medium" rounded />
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
        </button>

        <!-- User Menu Popover -->
        <Popover ref="userMenuPopover" class="user-menu-popover">
          <div class="w-72">
            <!-- Menu Actions -->
            <div class="py-2">
              <!-- Mi perfil -->
              <button
                type="button"
                class="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 focus:outline-none focus:bg-slate-50"
                @click="handleMenuAction('Mi perfil')"
              >
                <Icon icon="ion:person-outline" class="w-5 h-5 text-slate-600" />
                <span class="text-sm font-medium text-slate-700">Mi perfil</span>
              </button>

              <!-- Configuración -->
              <button
                type="button"
                class="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 focus:outline-none focus:bg-slate-50"
                @click="handleMenuAction('Configuración')"
              >
                <Icon icon="ion:settings-outline" class="w-5 h-5 text-slate-600" />
                <span class="text-sm font-medium text-slate-700">Configuración</span>
              </button>

              <!-- Plan y facturación -->
              <button
                type="button"
                class="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 focus:outline-none focus:bg-slate-50"
                @click="handleMenuAction('Plan y facturación')"
              >
                <Icon icon="ion:card-outline" class="w-5 h-5 text-slate-600" />
                <span class="text-sm font-medium text-slate-700">Plan y facturación</span>
              </button>
            </div>

            <!-- Logout Section -->
            <div class="border-t border-slate-200 py-2">
              <button
                type="button"
                class="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-red-50 focus:outline-none focus:bg-red-50"
                @click="handleLogout"
              >
                <Icon icon="ion:log-out-outline" class="w-5 h-5 text-red-600" />
                <span class="text-sm font-medium text-red-600">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </Popover>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Animaciones del Popover */
:deep(.p-popover) {
  animation: popoverFadeIn 0.2s ease-out;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

:deep(.p-popover-enter-from) {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

:deep(.p-popover-enter-active) {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.p-popover-leave-to) {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

:deep(.p-popover-leave-active) {
  transition: all 0.15s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes popoverFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
