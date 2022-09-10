import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  ForeignKey,
  DefaultScope,
  AutoIncrement,
  Default,
} from 'sequelize-typescript';
import { IIdentityModel } from '../interfaces';
import { ProfileModel } from '@/db/models/profile.model';
import { AccountTypeModel } from '@/db/models/account-type.model';
import { ACCOUNT_TYPES, PROFILE_STATUS } from '../enums';

@DefaultScope(() => ({
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Identity',
  timestamps: true,
})
export class IdentityModel extends Model<IIdentityModel> {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: number;

  @Column(
    DataType.ENUM(
      PROFILE_STATUS.VERIFIED,
      PROFILE_STATUS.CONTACT_SUPPORT,
      PROFILE_STATUS.IN_PROGRESS,
      PROFILE_STATUS.UPDATES_REQUIRED,
    ),
  )
  status: string;

  @ForeignKey(() => ProfileModel)
  @Column(DataType.BIGINT)
  profileId: ProfileModel;

  @Column(DataType.STRING)
  securitizeId: string;

  @ForeignKey(() => AccountTypeModel)
  @Default(ACCOUNT_TYPES.USER)
  @Column(DataType.ENUM(ACCOUNT_TYPES.PARTNER, ACCOUNT_TYPES.USER))
  accountType: ACCOUNT_TYPES;
}
