import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Identity } from '@/db/models';
import { IIdentityModel } from '@/db/interfaces';

@Injectable()
export class IdentityService {
  constructor(
    @InjectModel(Identity)
    private identityRepository: typeof Identity,
  ) {}

  async findByKey(searchKey: Partial<IIdentityModel>) {
    return this.identityRepository.findOne({
      where: searchKey,
    });
  }
}
