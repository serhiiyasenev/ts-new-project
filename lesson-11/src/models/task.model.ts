import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { UserModel } from "./user.model";
import { TaskStatus, TaskPriority } from "../dtos/taskResponse.dto";

@Table({ tableName: "tasks", timestamps: true })
export class TaskModel extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Title cannot be empty",
      },
      len: {
        args: [1, 255],
        msg: "Title must be between 1 and 255 characters",
      },
    },
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
    defaultValue: TaskStatus.Todo,
    validate: {
      isIn: {
        args: [Object.values(TaskStatus)],
        msg: "Invalid task status",
      },
    },
  })
  declare status: TaskStatus;

  @Column({
    type: DataType.ENUM(...Object.values(TaskPriority)),
    allowNull: false,
    defaultValue: TaskPriority.Medium,
    validate: {
      isIn: {
        args: [Object.values(TaskPriority)],
        msg: "Invalid task priority",
      },
    },
  })
  declare priority: TaskPriority;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare userId: number | null;

  @BelongsTo(() => UserModel)
  declare user?: UserModel | null;
}
