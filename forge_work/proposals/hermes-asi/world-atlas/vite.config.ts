import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Build to /world as base, so production site can serve at /world/ without
// having to rewrite routes. Static SSG-friendly.
export default defineConfig({
  plugins: [react()],
  base: '/world/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          map: ['react-simple-maps', 'd3-geo'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
