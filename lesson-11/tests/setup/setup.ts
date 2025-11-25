import { afterAll, beforeAll, beforeEach } from 'vitest';
import sequelize from '../../src/config/database';

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Truncate all tables
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});