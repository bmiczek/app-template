import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Don't use vite.config.ts which has TanStack Start plugin
    passWithNoTests: true,
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.output'],
  },
});
