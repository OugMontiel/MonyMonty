<script>
export default {
  name: "barra inferior de navegación entre vistas de tablero",
  data() {
    return {
      sections: [
        {name: "ingresos", label: "Ingresos"},
        {name: "gastos", label: "Gastos"},
        {name: "presupuesto", label: "Presupuesto"},
        {name: "resumen", label: "Resumen"},
      ],
      activeSection: null,
      isHidden: false,
      hideTimer: null,
    };
  },
  methods: {
    setActiveSection(section) {
      this.activeSection = section;
    },
    startHideTimer() {
      this.hideTimer = setTimeout(() => {
        this.isHidden = true;
      }, 5000);
    },
    showNav() {
      clearTimeout(this.hideTimer);
      this.isHidden = false;
    },
  },
  mounted() {
    this.startHideTimer();
  },
};
</script>

<template>
  <div>
    <div class="bottom-nav" :class="{hidden: isHidden}" @mouseenter="showNav" @mouseleave="startHideTimer">
      <nav>
        <button
          v-for="(section, index) in sections"
          :key="index"
          :class="{active: activeSection === section.name}"
          @click="setActiveSection(section.name)"
          :aria-label="section.name"
        >
          {{ section.label }}
        </button>
      </nav>
    </div>

    <div class="alt-nav" v-if="isHidden" @mouseenter="showNav">
      <span>Mostrar Navegación</span>
    </div>
  </div>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}

.bottom-nav.hidden {
  transform: translateX(-50%) translateY(100%);
  opacity: 0.5;
}

.bottom-nav nav {
  display: flex;
  gap: 1rem;
}

.bottom-nav button {
  background: none;
  border: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}

.bottom-nav button:hover {
  background-color: #f0f0f0;
}

.bottom-nav button.active {
  background-color: #007bff;
  color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
  animation: pulse 1.5s infinite;
}

.alt-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #007bff;
  color: #ffffff;
  border-radius: 10px 10px 0 0;
  padding: 0.5rem 1rem;
  text-align: center;
  cursor: pointer;
  z-index: 40;
  transition: opacity 0.3s ease-in-out;
}

.alt-nav:hover {
  background-color: #0056b3;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 123, 255, 0.8);
  }
}
</style>
