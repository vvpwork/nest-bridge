import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  ForeignKey,
  DefaultScope,
  Scopes,
  AutoIncrement,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { IIdentityModel } from '@Common/interfaces';
import { Profile } from '@/db/models/Profile.entity';
import { AccountType } from '@/db/models/AccountType.entity';
// import { Profile, AccountType } from './index';

@DefaultScope(() => ({
  attributes: {
    exclude: ['nonce'],
  },
  order: [['createdAt', 'DESC']],
}))
@Scopes(() => ({
  clean: {},
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

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Profile, 'identityId')
  profile: Profile;
}
