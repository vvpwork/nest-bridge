import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  BelongsTo,
  ForeignKey,
  DefaultScope,
} from 'sequelize-typescript';
import { IFollowerModel } from '@Common/interfaces';
import { Profile } from '@/db/models/Profile.entity';

@DefaultScope(() => ({
  attributes: ['profileId', 'targetProfileId'],
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Follower',
  timestamps: true,
})
export class Follower extends Model<IFollowerModel> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => Profile)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  profileId: number;

  @ForeignKey(() => Profile)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  targetProfileId: number;

  @BelongsTo(() => Profile, 'profileId')
  profile: Profile;

  @BelongsTo(() => Profile, 'targetProfileId')
  target: Profile;
}
