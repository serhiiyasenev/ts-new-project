import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/config/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "**/*.css",
        "public/**",
        "index.html",
        "**/*.js",
        "src/types/**",
        "test/**",
      ],
    },
  },
});
