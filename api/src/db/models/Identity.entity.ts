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
  BelongsTo,
} from 'sequelize-typescript';
import { IIdentityModel } from '../interfaces';
import { Profile } from '@/db/models/Profile.entity';
import { AccountType } from '@/db/models/AccountType.entity';

@DefaultScope(() => ({
  attributes: {
    exclude: ['nonce'],
  },
  order: [['createdAt', 'DESC']],
}))
@Table({
  tableName: 'Identity',
  timestamps: true,
})
export class Identity extends Model<IIdentityModel> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.BIGINT)
  id: number;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  address: string;

  @ForeignKey(() => Profile)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  profileId: number;

  @Column(DataType.STRING)
  securitizeId: string;

  @ForeignKey(() => AccountType)
  @AllowNull(false)
  @Column(DataType.STRING)
  accountType: string;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  nonce: number;

  @BelongsTo(() => Profile, 'profileId')
  profile: Profile;
}
