import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';
import { IBlockchainModel } from '../interfaces';

@Table({
  tableName: 'Blockchain',
  timestamps: false,
})
export class Blockchain extends Model<IBlockchainModel> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER)
  chainId: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  description: string;
}
