import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",

  // ✅ AGREGAR ESTA CONFIGURACIÓN DEL PROXY
  server: {
    proxy: {
      "/api": {
        target: "https://cometsur-api.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
      },
    },
  },

  // ✅ OPCIÓN ALTERNATIVA: Proxy más específico
  // server: {
  //   proxy: {
  //     '/auth': {
  //       target: 'https://cometsur-api.onrender.com',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     '/users': {
  //       target: 'https://cometsur-api.onrender.com',
  //       changeOrigin: true,
  //       secure: false,
  //     }
  //   }
  // }
});
