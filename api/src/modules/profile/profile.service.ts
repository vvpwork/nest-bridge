import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileEntity } from '@DB/models/Profile.entity';
import { EditProfileDto } from '@Modules/profile/dtos/editProfile.dto';
import { IdentityEntity } from '@DB/models';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileEntity)
    private profileModel: typeof ProfileEntity,
  ) {}

  async getById(id: number): Promise<ProfileEntity> {
    return this.profileModel.findByPk(id);
  }

  async updateById(id: number, params: EditProfileDto): Promise<{ success: true }> {
    // eslint-disable-next-line no-param-reassign,security/detect-object-injection
    Object.keys(params).forEach((key: string) => (params[key] === undefined || params[key] === null ? delete params[key] : {}));

    if (params.userName && params.userName !== '') {
      const alreadyExists = await this.profileModel.findOne({ where: { userName: params.userName }, attributes: ['id'], raw: true });
      if (alreadyExists) {
        throw new HttpException('USERNAME_ALREADY_EXISTS', HttpStatus.BAD_REQUEST);
      }
    }

    if (params.email && params.email !== '') {
      const alreadyExists = await this.profileModel.findOne({ where: { email: params.email }, attributes: ['id'], raw: true });
      if (alreadyExists) {
        throw new HttpException('EMAIL_ALREADY_EXISTS', HttpStatus.BAD_REQUEST);
      }
    }

    await this.profileModel.update(params, { where: { id } });
    return { success: true };
  }

  async getUserNameByProfileId(profileId: number): Promise<string | null> {
    const user = await IdentityEntity.findOne({
      where: { profileId },
      include: [
        {
          model: this.profileModel,
          as: 'profile',
          attributes: ['userName'],
        },
      ],
      attributes: ['address'],
    });
    if (user.profile.userName) {
      return user.profile.userName;
    }
    if (user.address) {
      return user.address;
    }
    return null;
  }
}
