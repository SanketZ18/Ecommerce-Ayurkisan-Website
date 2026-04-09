import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:9090",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          'vendor-motion': ['framer-motion'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});