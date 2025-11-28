import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { TaskModel } from "./task.model";
import { PostModel } from "./post.model";

@Table({ tableName: "users", timestamps: true })
export class UserModel extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  })
  declare email: string;
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;
  @Column({ type: DataType.DATE, allowNull: true })
  declare lastLoginAt: Date | null;
  @HasMany(() => TaskModel)
  declare tasks: TaskModel[];
  @HasMany(() => PostModel)
  declare posts: PostModel[];
}
