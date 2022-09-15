import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';
import { INftLikeModel } from '../interfaces';

import { NftModel } from '@/db/models/nft.model';
import { ProfileModel } from './profile.model';

@Table({
  tableName: 'NftLike',
  timestamps: true,
})
export class NftLikeModel extends Model<INftLikeModel> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => ProfileModel)
  @Column(DataType.BIGINT)
  profileId: ProfileModel;

  @ForeignKey(() => NftModel)
  @AllowNull(false)
  @Column(DataType.STRING)
  nftId: string;
}
