import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IdentityModel } from '@/db/models';
import { IIdentityModel } from '@/db/interfaces';

@Injectable()
export class IdentityService {
  constructor(
    @InjectModel(IdentityModel)
    private identityRepository: typeof IdentityModel,
  ) {}

  async findByKey(searchKey: Partial<IIdentityModel>) {
    return this.identityRepository.findOne({
      where: searchKey,
    });
  }
}
