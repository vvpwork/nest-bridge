import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  DefaultScope,
} from 'sequelize-typescript';
import { IFollowerModel } from '../interfaces';
import { ProfileModel } from '@/db/models/profile.model';

@DefaultScope(() => ({
  attributes: ['profileId', 'targetProfileId'],
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Follower',
  timestamps: true,
})
export class FollowerModel extends Model<IFollowerModel> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => ProfileModel)
  @Column(DataType.BIGINT)
  profileId: number;

  @ForeignKey(() => ProfileModel)
  @Column(DataType.BIGINT)
  targetProfileId: number;
}
