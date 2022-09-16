/* eslint-disable no-param-reassign */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { fn } from 'sequelize';
import {
  BlockchainIdentityAddressModel,
  FollowerModel,
  IdentityModel,
  LibraryModel,
  NewsLikeModel,
  NewsModel,
  NotificationModel,
  PodcastModel,
  ProfileModel,
} from '@DB/models';
import { InjectModel } from '@nestjs/sequelize';
import { paginate } from '@Common/utils/pagination.util';
import { NOTIFICATION_TYPES } from '@Common/enums';
import { IFollowerModel, IIdentityModel, IProfileModel } from '@DB/interfaces';
import { ACCOUNT_TYPES } from '@DB/enums';

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

    @InjectModel(NewsLikeModel)
    private newsLikeModel: typeof NewsLikeModel,

    @InjectModel(NotificationModel)
    private notificationModel: typeof NotificationModel,

    @InjectModel(BlockchainIdentityAddressModel)
    private blockchainIdentityAddressModel: typeof BlockchainIdentityAddressModel,
  ) {}

  async getById(id: number): Promise<ProfileModel> {
    return this.profileModel.findOne({ where: { id } });
  }

  async getByUserNameOrAddress(userNameOrAddress: string, viewerUser?: IIdentityModel) {
    let profile;
    if (userNameOrAddress.substring(0, 2) === '0x') {
      profile = await this.profileModel.findOne({
        include: [
          {
            model: this.identityModel,
            as: 'identity',
            attributes: ['accountType'],
            include: [
              {
                model: this.blockchainIdentityAddressModel,
                as: 'address',
                where: {
                  address: userNameOrAddress,
                },
                required: true,
              },
            ],
          },
        ],
      });
    } else {
      profile = await this.profileModel.findOne({
        where: {
          userName: userNameOrAddress,
        },
        include: [
          {
            model: this.identityModel,
            as: 'identity',
            attributes: ['accountType'],
            include: [
              {
                model: this.blockchainIdentityAddressModel,
                as: 'address',
              },
            ],
          },
        ],
      });
    }

    return this.processProfileData(profile, viewerUser);
  }

  async updateById(id: number, params: IProfileModel): Promise<void> {
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
  }

  async getLibrariesByProfileId(profileId: number, limit?: number, offset?: number) {
    return paginate(this.libraryModel, { where: { profileId }, limit, offset });
  }

  async getPodcastsByProfileId(profileId: number, limit?: number, offset?: number) {
    return paginate(this.podcastModel, { where: { profileId }, limit, offset });
  }

  async getNewsByProfileId(profileId: number, viewerUser?: IIdentityModel | null, limit?: number, offset?: number) {
    const paginatedData = await paginate(this.newsModel, { where: { profileId }, limit, offset });
    paginatedData.data = await Promise.all(
      paginatedData.data.map((news: NewsModel) => this.injectLikesToNewsRecord(news, viewerUser)),
    );

    return paginatedData;
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
    if (!isFollower) {
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
    const profile: ProfileModel = await this.profileModel.findOne({
      where: { id: profileId },
      attributes: ['userName'],
    });

    return profile.userName;
  }

  // ToDo move this and the same code to service, when circular dependencies are resolved
  async injectLikesToNewsRecord(newsRecord: NewsModel, viewerUser?: IIdentityModel) {
    const result = newsRecord;
    result.isLiked = false;

    result.likesCount = await this.getLikesCount(newsRecord.id);

    if (viewerUser) {
      result.isLiked = await this.isLiked(newsRecord.id, +viewerUser.profileId);
    }

    return result;
  }

  async getLikesCount(newsId: string): Promise<number> {
    return this.newsLikeModel.count({
      where: { newsId },
    });
  }

  async isLiked(newsId: string, profileId: number): Promise<boolean> {
    const newsLikeRecord = await this.newsLikeModel.findOne({
      where: { newsId, profileId },
      attributes: ['id'],
      raw: true,
    });
    return !!newsLikeRecord;
  }

  async getFollowList(
    type: 'followers' | 'followings',
    profileId: number,
    viewerUser?: IIdentityModel | null,
    limit?: number,
    offset?: number,
  ) {
    let where;
    if (type === 'followers') {
      where = { targetProfileId: profileId };
    } else {
      where = { profileId };
    }
    const allFollowsRecordsProfileIds = await this.followerModel
      .findAll({
        where,
        attributes: ['profileId'],
      })
      .then((followerRecords: FollowerModel[]) =>
        followerRecords.map((followerRecord: FollowerModel) => followerRecord.profileId),
      );

    const result = await paginate(this.profileModel, {
      where: { id: allFollowsRecordsProfileIds },
      attributes: [['id', 'profileId'], 'userName', 'avatar'],
      include: [
        {
          model: this.identityModel,
          as: 'identity',
          attributes: ['accountType', 'id'],
          include: [
            {
              model: this.blockchainIdentityAddressModel,
              as: 'address',
              attributes: ['address'],
            },
          ],
        },
      ],
      limit,
      offset,
    });

    const listOfFollowersCount = await this.getAllFollowersCounts();
    let listOfAllProfileIdsFollowedByUser: number[] = [];
    if (viewerUser) {
      listOfAllProfileIdsFollowedByUser = await this.getAllFollowingsListByProfileId(viewerUser.profileId);
    }

    result.data = await Promise.all(
      result.data.map((item: any) =>
        this.injectDataToFollowList(item, listOfFollowersCount, listOfAllProfileIdsFollowedByUser),
      ),
    );

    return result;
  }

  async injectDataToFollowList(profile: any, listOfFollowersCount: any, listOfAllProfileIdsFollowedByUser: number[]) {
    profile.dataValues.followers = listOfFollowersCount[profile.dataValues.profileId]
      ? listOfFollowersCount[profile.dataValues.profileId]
      : 0;

    profile.dataValues.isFollower = false;
    if (listOfAllProfileIdsFollowedByUser) {
      profile.dataValues.isFollower = listOfAllProfileIdsFollowedByUser.includes(profile.dataValues.profileId);
    }

    profile.dataValues.isPartner = profile.identity.accountType === ACCOUNT_TYPES.PARTNER;
    profile.dataValues.address = profile.identity.address[0].address;
    delete profile.dataValues.identity;

    return profile;
  }

  async processProfileData(profile: any, viewerUser?: IIdentityModel) {
    if (!profile) {
      throw new HttpException('PROFILE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    profile.dataValues.isPartner = profile.identity.accountType === ACCOUNT_TYPES.PARTNER;
    profile.dataValues.address = profile.identity.address[0].address;
    delete profile.dataValues.identity;

    profile.dataValues.followersCount = await this.getFollowersCount(profile.id);
    profile.dataValues.followingCount = await this.getFollowingCount(profile.id);

    profile.dataValues.isFollower = false;
    if (viewerUser) {
      profile.dataValues.isFollower = await this.isFollower(viewerUser.profileId, profile.id);
    }

    return profile;
  }

  async getFollowersCount(profileId: string) {
    return this.followerModel.count({
      where: { targetProfileId: profileId },
    });
  }

  async getFollowingCount(profileId: string) {
    return this.followerModel.count({
      where: { profileId },
    });
  }

  async getAllFollowersCounts() {
    const allCountsList: any[] = await this.followerModel.findAll({
      attributes: ['targetProfileId', 'profileId', [fn('COUNT', 'profileId'), 'followersCount']],
      group: ['targetProfileId'],
    });

    let formattedCountsObject;
    if (allCountsList.length) {
      formattedCountsObject = {};
      allCountsList.forEach((item: any) => {
        formattedCountsObject[item.targetProfileId] = item.dataValues.followersCount;
      });
    }

    return formattedCountsObject;
  }

  // get array containing all profileIds of users followed by current user
  async getAllFollowingsListByProfileId(sourceProfileId: number): Promise<number[]> {
    return this.followerModel
      .findAll({
        where: { profileId: sourceProfileId },
        attributes: ['targetProfileId'],
      })
      .then((allTargets: Pick<FollowerModel, 'targetProfileId'>[]) =>
        allTargets.map((target: Pick<FollowerModel, 'targetProfileId'>) => target.targetProfileId),
      );
  }
}
