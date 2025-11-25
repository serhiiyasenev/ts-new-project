import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserModel } from './user.model';

@Table({tableName: 'tasks', timestamps: true})
export class TaskModel extends Model {
  @Column({type: DataType.STRING, allowNull: false})
  declare title: string;
  @Column({type: DataType.STRING, allowNull: true})
  declare description: string;
  @Column({type: DataType.STRING, allowNull: false})
  declare status: string;
  @Column({type: DataType.STRING, allowNull: false})
  declare priority: string;
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare userId: number;
  @BelongsTo(() => UserModel)
  declare user?: UserModel | null;
}
