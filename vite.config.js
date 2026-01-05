import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 1️⃣ Increase chunk size warning limit to 1MB (1000 KB)
    chunkSizeWarningLimit: 1000,

    // 2️⃣ Base path for deployment
    // '/' if deployed at root domain
    // '/subfolder/' if deployed in a subfolder
    base: '/',
  },
  resolve: {
    alias: {
      // Optional: allows imports like import X from '@/components/X'
      '@': '/src',
    },
  },
})
