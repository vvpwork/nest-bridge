import { Table, Column, Model, DataType, PrimaryKey, AllowNull } from 'sequelize-typescript';
import { IBlockchainModel } from '@Common/interfaces';

@Table({
  tableName: 'Blockchain',
  timestamps: false,
})
export class BlockchainEntity extends Model<IBlockchainModel> {
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
