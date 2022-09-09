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
  @AutoIncrement
  @Column(DataType.BIGINT)
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

  @AllowNull(false)
  @Column(DataType.STRING)
  address: string;

  @ForeignKey(() => ProfileModel)
  @Column(DataType.BIGINT)
  profileId: ProfileModel;

  @Column(DataType.STRING)
  securitizeId: string;

  @ForeignKey(() => AccountTypeModel)
  @Column(DataType.ENUM(ACCOUNT_TYPES.PARTNER, ACCOUNT_TYPES.USER))
  accountType: ACCOUNT_TYPES;
}
