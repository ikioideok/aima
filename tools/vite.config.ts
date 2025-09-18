import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const tailwindcss = (() => {
  const load = (specifier: string) => {
    const mod = require(specifier)
    return mod?.default ?? mod
  }
  try {
    return load('../media/node_modules/tailwindcss')
  } catch {
    return load('tailwindcss')
  }
})()

export default defineConfig({
  root: path.resolve(__dirname, '..'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  base: '/tools/',
  define: {
    'import.meta.env.VITE_CMS_API_BASE': JSON.stringify(process.env.VITE_CMS_API_BASE || ''),
    'import.meta.env.VITE_ADMIN_TOKEN': JSON.stringify(process.env.VITE_ADMIN_TOKEN || ''),
  },
  build: {
    outDir: path.resolve(__dirname, '../dist/tools'),
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: path.resolve(__dirname, '../tailwind.config.js') }),
        autoprefixer(),
      ],
    },
  },
})
