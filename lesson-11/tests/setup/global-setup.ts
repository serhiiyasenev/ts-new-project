import { register } from "tsconfig-paths";
import sequelize from "../../src/config/database";

// Register tsconfig paths for @shared alias BEFORE any imports
register({
  baseUrl: __dirname + "/../../",
  paths: {
    "@shared/*": ["../shared/*"],
  },
});

export default async function globalSetup() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("global-setup must run with NODE_ENV=test");
  }

  // Ensure DB is reachable and reset schema once before workers spawn
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  // Close connection here; workers will open their own connections when needed
  await sequelize.close();
}
