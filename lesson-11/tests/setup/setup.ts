import { afterAll, beforeAll } from "vitest";
import { register } from "tsconfig-paths";
import sequelize from "../../src/config/database";

// Register tsconfig paths for @shared alias
register({
  baseUrl: "../",
  paths: {
    "@shared/*": ["../shared/*"],
  },
});

// Single place for DB clean-up: runs once before the whole test suite.
beforeAll(async () => {
  // Ensure we're running against the test database
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "Tests must run with NODE_ENV=test to avoid wiping non-test DB",
    );
  }

  // Connect and reset schema (drops and recreates tables)
  await sequelize.authenticate();
});

afterAll(async () => {
  await sequelize.close();
});
// This file runs in each worker environment. Database schema reset is performed
// once in `global-setup.ts` (before workers spawn). Keep this file for any
// per-worker initialization if needed (currently no-op).
