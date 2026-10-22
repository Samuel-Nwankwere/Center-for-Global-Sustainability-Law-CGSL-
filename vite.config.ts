/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// `--mode demo` produces a fully static, relative-path build that can be opened
// from any sub-path (e.g. a shared preview link) using hash-based routing.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'demo' || mode === 'artifact' ? './' : '/',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    outDir: mode === 'demo' ? 'dist-demo' : mode === 'artifact' ? 'dist-artifact' : 'dist',
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
}));
