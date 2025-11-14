import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: './',
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.test.{ts,js}']
  }
});
