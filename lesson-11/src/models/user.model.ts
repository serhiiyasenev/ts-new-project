import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({tableName: 'users', timestamps: true})
export class UserModel extends Model {
  @Column({type: DataType.STRING, allowNull: false})
  declare name: string;
  @Column({type: DataType.STRING, allowNull: false, unique: true, validate: { isEmail: true }})
  declare email: string;
}
