import { Sequelize } from "sequelize-typescript";
import { UserModel } from "../models/user.model";
import { TaskModel } from "../models/task.model";
import { PostModel } from "../models/post.model";

const sequelize = new Sequelize({
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  database: process.env.NODE_ENV === "test" ? "db_test" : "db_development",
  username: "postgres",
  password: "admin",
  logging: false,
  models: [UserModel, TaskModel, PostModel],
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

if (process.env.NODE_ENV !== "test") {
  sequelize
    .sync({ alter: true })
    .then(() => {
      console.log("Database synchronized successfully.");
    })
    .catch((error) => {
      console.error("Error synchronizing the database:", error);
    });
}

export default sequelize;
