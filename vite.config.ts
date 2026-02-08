import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // Base path for GitHub Pages deployment (must match repo name case)
  base: '/DSA-Mastery/',
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
    },
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        // SCSS options
      },
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  
  server: {
    port: 3000,
    open: true,
  },
});
