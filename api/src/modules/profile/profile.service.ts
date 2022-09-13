import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { EditProfileDto } from '@Modules/profile/dtos/editProfile.dto';
import {
  FollowerModel,
  IdentityModel,
  LibraryModel,
  NewsModel,
  NotificationModel,
  PodcastModel,
  ProfileModel,
} from '@DB/models';
import { InjectModel } from '@nestjs/sequelize';
import { paginate } from '@Common/utils/pagination.util';
import { NOTIFICATION_TYPES } from '@Common/enums';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileModel)
    private profileModel: typeof ProfileModel,

    @InjectModel(IdentityModel)
    private identityModel: typeof IdentityModel,

    @InjectModel(LibraryModel)
    private libraryModel: typeof LibraryModel,

    @InjectModel(PodcastModel)
    private podcastModel: typeof PodcastModel,

    @InjectModel(NewsModel)
    private newsModel: typeof NewsModel,

    @InjectModel(FollowerModel)
    private followerModel: typeof FollowerModel,

    @InjectModel(NotificationModel)
    private notificationModel: typeof NotificationModel,
  ) {}

  async getById(id: number): Promise<ProfileModel> {
    return this.profileModel.findOne({ where: { id } });
  }

  async updateById(id: number, params: EditProfileDto): Promise<{ success: true }> {
    if (params.userName && params.userName !== '') {
      const alreadyExists = await this.profileModel.findOne({
        where: { userName: params.userName },
        attributes: ['id'],
        raw: true,
      });
      if (alreadyExists) {
        throw new HttpException('USERNAME_ALREADY_EXISTS', HttpStatus.BAD_REQUEST);
      }
    }

    if (params.email && params.email !== '') {
      const alreadyExists = await this.profileModel.findOne({
        where: { email: params.email },
        attributes: ['id'],
        raw: true,
      });
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

  async getNewsByProfileId(profileId: number, limit?: number, offset?: number) {
    return paginate(this.newsModel, { query: { where: { profileId } }, limit, offset });
  }

  async followByProfileId(sourceProfileId: number, targetProfileId: number): Promise<{ success: boolean }> {
    const profile = await this.profileModel.findByPk(targetProfileId);
    if (!profile) {
      throw new HttpException('PROFILE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const isFollower = await this.isFollower(sourceProfileId, targetProfileId);
    if (isFollower) {
      throw new HttpException('IS_ALREADY_FOLLOWER', HttpStatus.BAD_REQUEST);
    }

    await this.followerModel.create({ profileId: sourceProfileId, targetProfileId });

    await this.notificationModel.create({
      profileId: profile.id,
      type: NOTIFICATION_TYPES.NEW_FOLLOWER,
      params: {
        name: await this.getUserNameByProfileId(sourceProfileId),
        image: profile.avatar,
      },
    });

    return { success: true };
  }

  async unFollowByProfileId(sourceProfileId: number, targetProfileId: number): Promise<{ success: boolean }> {
    const profile = await this.profileModel.findByPk(targetProfileId);
    if (!profile) {
      throw new HttpException('PROFILE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const isFollower = await this.isFollower(sourceProfileId, targetProfileId);
    if (isFollower) {
      throw new HttpException('IS_NOT_FOLLOWER', HttpStatus.BAD_REQUEST);
    }

    await this.followerModel.destroy({ where: { profileId: sourceProfileId, targetProfileId } });

    return { success: true };
  }

  async isFollower(sourceProfileId: number, targetProfileId: number) {
    const followerRecord = await this.followerModel.findOne({
      where: { profileId: sourceProfileId, targetProfileId },
      attributes: ['profileId', 'targetProfileId'],
    });
    return !!followerRecord;
  }

  async getUserNameByProfileId(profileId: number): Promise<string | null> {
    const user: any = await this.identityModel.findOne({
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
