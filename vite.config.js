import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',      // default build folder
    chunkSizeWarningLimit: 1000,
  },
  base: '/',             // ensures assets load correctly
})
