import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BlockchainIdentityAddressModel, IdentityModel, ProfileModel } from '@/db/models';
import { IIdentityModel } from '@/db/interfaces';

@Injectable()
export class IdentityService {
  constructor(
    @InjectModel(IdentityModel)
    private identityRepository: typeof IdentityModel,
    @InjectModel(BlockchainIdentityAddressModel)
    private bcAddressModel: typeof BlockchainIdentityAddressModel,

    @InjectModel(ProfileModel)
    private profile: typeof ProfileModel,
  ) {}

  async findByKey(searchKey: Partial<IIdentityModel>) {
    const query = `
    SELECT DISTINCT id.*, bc.address, pr.name, pr.avatar, pr.cover FROM Identity id
    LEFT JOIN BlockchainIdentityAddress bc On bc.identityId = id.id
    LEFT JOIN Profile pr ON pr.id = id.profileID
    WHERE id.id = '${searchKey.id}'
    GROUP BY id.id
    `;
    const [data] = await this.identityRepository.sequelize.query(query);
    return data[0];
  }
}
