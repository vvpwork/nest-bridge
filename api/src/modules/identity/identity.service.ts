import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BlockchainIdentityAddressModel, IdentityModel, ProfileModel } from '@DB/models';
import { IIdentityModel } from '@DB/interfaces';

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
    SELECT DISTINCT id.*, bc.address, bc.chainId, pr.name, pr.userName, pr.avatar, pr.cover FROM Identity id
    LEFT JOIN BlockchainIdentityAddress bc On bc.identityId = id.id
    LEFT JOIN Profile pr ON pr.id = id.profileID
    WHERE id.id = '${searchKey.id}'
    GROUP BY id.id
    `;
    const [data] = await this.identityRepository.sequelize.query(query);
    return data[0];
  }

  async updateById(id: string, params: Partial<IIdentityModel>) {
    const identity = await this.identityRepository.update(params, {
      where: {
        id,
      },
      returning: true,
    });
    return identity;
  }
}
