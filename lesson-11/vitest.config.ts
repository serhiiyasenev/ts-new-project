import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      lines: 100,
      statements: 100,
      branches: 100,
      functions: 100,
      include: [
        'src/services/**/*.ts',
        'src/schemas/**/*.ts',
        'src/helpers/**/*.ts',
        'src/types/errors.ts'
      ],
      exclude: [
        'src/config/**',
        'src/swagger/**',
        'src/routes-tsoa/**',
        'src/server.ts',
        'src/dtos/**',
        'src/types/**'
      ]
    }
  }
});
