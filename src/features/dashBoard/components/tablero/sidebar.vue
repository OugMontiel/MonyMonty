<script>
import {ref, computed} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useAuth} from "@/features/auth/logic/useAuth.js";

export default {
  name: "Sidebar",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const {logout} = useAuth();
    const isCollapsed = ref(false);

    const menuItems = [
      {
        id: "customers",
        icon: "people-outline",
        title: "Customers",
        path: "/customers",
      },
      {
        id: "messages",
        icon: "chatbubble-outline",
        title: "Messages",
        path: "/messages",
      },
      {
        id: "help",
        icon: "help-outline",
        title: "Help",
        path: "/help",
      },
      {
        id: "settings",
        icon: "settings-outline",
        title: "Settings",
        path: "/settings",
      },
      {
        id: "password",
        icon: "lock-closed-outline",
        title: "Password",
        path: "/password",
      },
    ];

    const isActive = (path) => {
      return route.path === path;
    };

    const navigate = (path) => {
      router.push(path);
    };

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    const handleLogout = async () => {
      try {
        await logout();
        router.push("/login");
      } catch (error) {
        console.error("Error durante logout:", error);
      }
    };

    const sidebarWidth = computed(() => {
      return isCollapsed.value ? "80px" : "240px";
    });

    return {
      menuItems,
      isActive,
      navigate,
      handleLogout,
      toggleSidebar,
      isCollapsed,
      sidebarWidth,
    };
  },
};
</script>

<template>
  <div class="sidebar-container" :style="{width: sidebarWidth}">
    <nav class="navigation" :class="{collapsed: isCollapsed}">
      <!-- Header -->
      <div class="header">
        <span class="icon">
          <ion-icon name="home-outline"></ion-icon>
        </span>
        <transition name="fade">
          <span v-if="!isCollapsed" class="title">Dashboard</span>
        </transition>
      </div>

      <!-- Toggle Button -->
      <button class="toggle-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
        <ion-icon :name="isCollapsed ? 'chevron-forward-outline' : 'chevron-back-outline'"></ion-icon>
      </button>

      <!-- Menu Items -->
      <ul class="menu-list">
        <li v-for="item in menuItems" :key="item.id" :class="{active: isActive(item.path)}">
          <a @click.prevent="navigate(item.path)">
            <span class="icon">
              <ion-icon :name="item.icon"></ion-icon>
            </span>
            <transition name="fade">
              <span v-if="!isCollapsed" class="title">{{ item.title }}</span>
            </transition>
          </a>
        </li>

        <!-- Logout -->
        <li class="logout-item">
          <a @click.prevent="handleLogout">
            <span class="icon">
              <ion-icon name="log-out-outline"></ion-icon>
            </span>
            <transition name="fade">
              <span v-if="!isCollapsed" class="title">Sign out</span>
            </transition>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.sidebar-container {
  transition: width 0.3s ease;
  flex-shrink: 0;
}

.navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background: var(--color-acento);
  overflow: hidden;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.navigation.collapsed {
  width: 80px;
}

/* Header */
.navigation .header {
  display: flex;
  align-items: center;
  padding: 25px 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navigation .header .icon {
  font-size: 1.75rem;
  min-width: 40px;
  text-align: center;
  color: #fff;
}

.navigation .header .title {
  margin-left: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

/* Toggle Button */
.toggle-btn {
  position: absolute;
  top: 30px;
  right: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

/* Menu List */
.menu-list {
  list-style: none;
  padding: 10px 0;
  margin: 0;
  width: 100%;
  flex: 1;
  overflow-y: auto;
}

.menu-list::-webkit-scrollbar {
  width: 5px;
}

.menu-list::-webkit-scrollbar-track {
  background: transparent;
}

.menu-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.menu-list li {
  margin: 5px 10px 5px 0;
  border-radius: 0 30px 30px 0;
  transition: all 0.3s ease;
  position: relative;
}

.menu-list li:hover,
.menu-list li.active {
  background-color: #000;
}

.menu-list li a {
  display: flex;
  position: relative;
  align-items: center;
  padding: 15px 20px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
}

.menu-list li:hover a,
.menu-list li.active a {
  color: #ff4444;
}

.menu-list li a .icon {
  font-size: 1.75rem;
  min-width: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-list li a .title {
  margin-left: 10px;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
}

/* Curvas decorativas en hover y active */
.menu-list li:hover a::before,
.menu-list li.active a::before,
.menu-list li:hover a::after,
.menu-list li.active a::after {
  content: "";
  position: absolute;
  right: 0;
  width: 50px;
  height: 50px;
  background: transparent;
  border-radius: 50%;
  pointer-events: none;
}

.menu-list li:hover a::before,
.menu-list li.active a::before {
  top: -50px;
  box-shadow: 35px 35px 0 10px #000;
}

.menu-list li:hover a::after,
.menu-list li.active a::after {
  bottom: -50px;
  box-shadow: 35px -35px 0 10px #000;
}

/* Logout item al final */
.logout-item {
  margin-top: auto !important;
  margin-bottom: 20px !important;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .navigation {
    width: 80px;
  }

  .navigation .header .title,
  .navigation .menu-list li a .title {
    display: none;
  }

  .toggle-btn {
    display: none;
  }
}
</style>
