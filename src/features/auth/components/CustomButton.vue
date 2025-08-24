<script>
export default {
  name: "CustomButton",
  props: {
    label: {type: String, required: true},
    to: {type: String, default: null}, // ruta opcional
    background: {type: String, default: "#28a745"},
    textColor: {type: String, default: "#ffffff"},
    fullWidth: {type: Boolean, default: true},
    customClick: {type: Function, default: null},
  },
  methods: {
    handleClick() {
      if (this.customClick) {
        this.customClick(); // ejecuta función personalizada
      } else if (this.to) {
        this.$router.push(this.to); // navegación por ruta
      }
    },
  },
};
</script>

<template>
  <button
    :style="{
      backgroundColor: background,
      color: textColor,
      width: fullWidth ? '100%' : 'auto',
    }"
    class="custom-button"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.custom-button {
  padding: 10px;
  border: none;
  font-weight: bold;
  font-size: var(--font-size-botones);
  border-radius: var(--border-radius-botones);
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.custom-button:hover {
  opacity: 0.9;
}
</style>
