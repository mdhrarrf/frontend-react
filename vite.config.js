import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Wajib di 2026

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Engine v4 jalan di sini
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }
    }
  }
})