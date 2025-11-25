import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { TaskModel } from './task.model';

@Table({tableName: 'users', timestamps: true})
export class UserModel extends Model {
  @Column({type: DataType.STRING, allowNull: false})
  declare name: string;
  @Column({type: DataType.STRING, allowNull: false, unique: true, validate: { isEmail: true }})
  declare email: string;
  @HasMany(() => TaskModel)
  declare tasks: TaskModel[];
}
