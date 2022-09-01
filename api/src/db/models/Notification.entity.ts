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
import { ProfileEntity } from '@/db/models/Profile.entity';
import { NotificationTypeEntity } from '@/db/models/NotificationType.entity';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Notification',
  timestamps: true,
})
export class NotificationEntity extends Model<INotificationModel> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => ProfileEntity)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  profileId: number;

  @AllowNull(true)
  @Default({})
  @Column(DataType.JSONB)
  params: object;

  @ForeignKey(() => NotificationTypeEntity)
  @AllowNull(false)
  @Column(DataType.STRING)
  type: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isRead: boolean;

  @BelongsTo(() => ProfileEntity, 'profileId')
  profile: ProfileEntity;
}
