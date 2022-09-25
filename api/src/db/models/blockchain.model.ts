import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  BelongsTo,
} from 'sequelize-typescript';
import { ProfileModel } from '@DB/models/profile.model';
import { IdentityModel } from '@DB/models/identity.model';
import { IBlockchainModel } from '../interfaces';

@Table({
  tableName: 'Blockchain',
  timestamps: false,
})
export class BlockchainModel extends Model<IBlockchainModel> {
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
