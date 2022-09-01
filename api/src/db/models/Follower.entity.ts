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
import { ProfileEntity } from '@/db/models/Profile.entity';

@DefaultScope(() => ({
  attributes: ['identityId', 'targetIdentityId'],
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Follower',
  timestamps: true,
})
export class FollowerEntity extends Model<IFollowerModel> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => ProfileEntity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  profileId: number;

  @ForeignKey(() => ProfileEntity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  targetProfileId: number;

  @BelongsTo(() => ProfileEntity, 'profileId')
  profile: ProfileEntity;

  @BelongsTo(() => ProfileEntity, 'targetProfileId')
  target: ProfileEntity;
}
