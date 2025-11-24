import { Sequelize } from "sequelize-typescript";
import { UserModel } from "../models/user.model";

const sequelize = new Sequelize({
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  database: 'db_development',
  username: 'postgres',
  password: 'admin',
  logging: false,
  models: [UserModel],
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((error) => {
    console.error('Error synchronizing the database:', error);
  });

export default sequelize;