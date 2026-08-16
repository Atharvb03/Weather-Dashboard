import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

// Vitest configuration for testing Vue components
export default defineConfig({
  plugins: [vue()], // Enable Vue 3 support in tests
  test: {
    globals: true, // Use global test functions (describe, it, expect) without importing
    environment: 'jsdom', // Simulate browser environment for Vue components
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // Allow @/ imports
    },
  },
});
