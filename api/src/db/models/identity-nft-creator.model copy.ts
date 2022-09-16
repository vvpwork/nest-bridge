/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { IIdentityNftCreator } from '../interfaces';
import { BlockchainIdentityAddressModel } from './blockchain-identity-address.model';
import { IdentityModel } from './identity.model';
import { NftModel } from './nft.model';

@Table({
  tableName: 'IdentityNftCreator',
  timestamps: false,
})
export class IdentityNftCreatorModel extends Model<IIdentityNftCreator> {
  @ForeignKey(() => IdentityModel)
  @Column(DataType.UUID)
  identityId: IdentityModel;

  @ForeignKey(() => NftModel)
  @Column(DataType.STRING)
  nftId: NftModel;

  @ForeignKey(() => BlockchainIdentityAddressModel)
  @Column(DataType.STRING)
  address: BlockchainIdentityAddressModel;

  @BelongsTo(() => IdentityModel, 'identityId')
  identity: IdentityModel;

  @BelongsTo(() => BlockchainIdentityAddressModel, 'address')
  blockChainAddress: BlockchainIdentityAddressModel;

  @BelongsTo(() => NftModel, 'nftId')
  nft: NftModel;
}
