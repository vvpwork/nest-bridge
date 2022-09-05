import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  DefaultScope,
  AllowNull,
  Default,
  ForeignKey,
  AutoIncrement,
  BelongsTo,
} from 'sequelize-typescript';
import { INotificationModel } from '@Common/interfaces';
import { Profile } from '@/db/models/Profile.entity';
import { NotificationType } from '@/db/models/NotificationType.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Notification',
  timestamps: true,
})
export class Notification extends Model<INotificationModel> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => Profile)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  profileId: number;

  @AllowNull(true)
  @Default({})
  @Column(DataType.JSONB)
  params: object;

  @ForeignKey(() => NotificationType)
  @AllowNull(false)
  @Column(DataType.STRING)
  type: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isRead: boolean;

  @BelongsTo(() => Profile, 'profileId')
  profile: Profile;
}
