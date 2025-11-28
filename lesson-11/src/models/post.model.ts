import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { UserModel } from "./user.model";

@Table({ tableName: "posts", timestamps: true })
export class PostModel extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;
  @Column({ type: DataType.TEXT, allowNull: false })
  declare content: string;
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;
  @BelongsTo(() => UserModel)
  declare user: UserModel;
}
