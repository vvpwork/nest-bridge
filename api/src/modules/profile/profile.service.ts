import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Profile } from '@DB/models/Profile.entity';
import { EditProfileDto } from '@Modules/profile/dtos/editProfile.dto';
import { Identity, Library, Podcast } from '@DB/models';
import { InjectModel } from '@nestjs/sequelize';
import { paginate } from '@Common/utils/pagination.util';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile)
    private profileModel: typeof Profile,

    @InjectModel(Identity)
    private identityModel: typeof Identity,

    @InjectModel(Library)
    private libraryModel: typeof Library,

    @InjectModel(Podcast)
    private podcastModel: typeof Podcast,
  ) {}

  async getById(id: number): Promise<Profile> {
    return this.profileModel.findOne({ where: { id } });
  }

  async updateById(id: number, params: EditProfileDto): Promise<{ success: true }> {
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

  async getLibrariesByProfileId(profileId: number, limit?: number, offset?: number) {
    return paginate(this.libraryModel, { query: { where: { profileId } }, limit, offset });
  }

  async getPodcastsByProfileId(profileId: number, limit?: number, offset?: number) {
    return paginate(this.podcastModel, { query: { where: { profileId } }, limit, offset });
  }

  async getUserNameByProfileId(profileId: number): Promise<string | null> {
    const user = await this.identityModel.findOne({
      where: { id: profileId },
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
