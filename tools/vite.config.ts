import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import autoprefixer from 'autoprefixer'
import { createRequire } from 'module'

const rootRequire = createRequire(import.meta.url)

const mediaRequire = (() => {
  try {
    return createRequire(path.resolve(__dirname, '../media/package.json'))
  } catch {
    return null
  }
})()

const resolveTailwindPlugin = () => {
  type NodeRequireFn = ReturnType<typeof createRequire>
  const tryLoad = (loader: NodeRequireFn | null, specifier: string) => {
    if (!loader) return null
    try {
      const mod = loader(specifier)
      return mod?.default ?? mod
    } catch {
      return null
    }
  }

  const attempts: Array<{
    loader: NodeRequireFn | null
    specifier: string
  }> = [
    { loader: mediaRequire, specifier: 'tailwindcss' },
    { loader: rootRequire, specifier: 'tailwindcss-tools' },
  ]

  for (const attempt of attempts) {
    const plugin = tryLoad(attempt.loader, attempt.specifier)
    if (plugin) {
      return plugin
    }
  }

  throw new Error(
    'Tailwind CSS for the tools build was not found. Install media dependencies with "npm --prefix media ci" before building.'
  )
}

const tailwind = resolveTailwindPlugin()

const tailwindOptions = { config: path.resolve(__dirname, '../media/tailwind.config.js') }

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
        tailwind(tailwindOptions),
        autoprefixer(),
      ],
    },
  },
})
