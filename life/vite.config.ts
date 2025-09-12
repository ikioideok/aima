
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': require('path').resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        // 開発用: ブラウザから OpenAI を叩くとCORSになるためプロキシ
        '/openai': {
          target: 'https://api.openai.com',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/openai/, ''),
        },
      },
    },
  });
