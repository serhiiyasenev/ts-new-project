import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
    setupFiles: ['./tests/setup/setup.ts'],
    globalSetup: './tests/setup/global-setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: [
        'src/controllers/**/*.ts',
        'src/dtos/**/*.ts',
        'src/helpers/**/*.ts',
        'src/schemas/**/*.ts',
        'src/services/**/*.ts',
        'src/types/**/*.ts'
      ],
      exclude: [
        'src/config/**',
        'src/swagger/**',
        'src/routes-tsoa/**',
        'src/server.ts'
      ]
    }
  }
});
