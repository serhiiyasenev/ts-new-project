import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
}
