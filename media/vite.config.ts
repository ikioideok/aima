import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_CMS_API_BASE': JSON.stringify(process.env.VITE_CMS_API_BASE || ''),
    'import.meta.env.VITE_ADMIN_TOKEN': JSON.stringify(process.env.VITE_ADMIN_TOKEN || ''),
  },
  base: '/media/',
  build: {
    outDir: '../dist/media',
    emptyOutDir: false
  }
})
