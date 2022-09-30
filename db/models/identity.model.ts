/* eslint-disable import/no-cycle */
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
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { BlockchainModel } from './blockchain.model';
import { IIdentityModel } from '../interfaces';
import { ProfileModel } from './profile.model';
import { AccountTypeModel } from './account-type.model';
import { ACCOUNT_TYPES, PROFILE_STATUS } from '../enums';
import { CollectionModel } from './collection.model';
import { BlockchainIdentityAddressModel } from './blockchain-identity-address.model';

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
  id: string;

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
  profileId: number;

  @Column(DataType.STRING)
  securitizeId: string;

  @ForeignKey(() => AccountTypeModel)
  @Default(ACCOUNT_TYPES.USER)
  @Column(DataType.ENUM(ACCOUNT_TYPES.PARTNER, ACCOUNT_TYPES.USER))
  accountType: ACCOUNT_TYPES;

  @HasMany(() => CollectionModel, 'identityId')
  identity: CollectionModel;

  @HasMany(() => BlockchainIdentityAddressModel, 'identityId')
  address: BlockchainIdentityAddressModel;

  @BelongsTo(() => ProfileModel, 'profileId')
  profile: ProfileModel;
}
