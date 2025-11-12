import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Configuración de alias
    },
  },
  server: {
    proxy: {
      '/auth': {
        target: 'https://api.monteflor.co',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
