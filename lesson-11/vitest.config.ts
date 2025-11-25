import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
      include: ["src/services/**/*.ts"],
      exclude: [
        "src/config/**",
        "src/swagger/**",
        "src/routes-tsoa/**",
        "src/server.ts",
        "src/dtos/**",
        "src/types/**",
      ],
    }
  }
});
