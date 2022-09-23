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
import { INotificationModel } from '../interfaces';
import { ProfileModel } from '@/db/models/profile.model';
import { NotificationTypeModel } from '@/db/models/notification-type.model';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Notification',
  timestamps: true,
})
export class NotificationModel extends Model<INotificationModel> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @ForeignKey(() => ProfileModel)
  @Column(DataType.BIGINT)
  profileId: ProfileModel;

  @AllowNull(true)
  @Default({})
  @Column(DataType.JSON)
  params: object;

  @ForeignKey(() => NotificationTypeModel)
  @Column(DataType.STRING)
  type: NotificationTypeModel;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isRead: boolean;

  @BelongsTo(() => ProfileModel, 'profileId')
  profile: ProfileModel;
}
