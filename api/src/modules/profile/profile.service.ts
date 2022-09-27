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

import { IProfileModel } from '@DB/interfaces';
import { ACCOUNT_TYPES, NOTIFICATION_TYPES } from '@DB/enums';
import { IUserInterface } from '@/common/interfaces';

// TODO refactoring followers
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

  async getById(id: string) {
    const query = `
    SELECT DISTINCT id.*, bc.address, pr.name, 
    pr.avatar, pr.cover, pr.userName,
    pr.website, pr.socials, pr.email, pr.bio, pr.sections,
    pr.communityLink,
    IF(fl.id, 1, 0) as isFollowing,
    IF(fol.count, fol.count, 0) as followers,
    IF(follower.count, follower.count, 0) as followings
    FROM Identity id
    LEFT JOIN BlockchainIdentityAddress bc On bc.identityId = id.id
    LEFT JOIN Profile pr ON pr.id = id.profileID
    LEFT JOIN Follower fl On fl.profileId = pr.id
    LEFT JOIN (
      SELECT flw.targetProfileId, count(flw.id) as count  from Follower flw
      GROUP BY flw.targetProfileId
    ) fol On fol.targetProfileId = pr.id
    LEFT JOIN (
      SELECT flw.profileId, count(flw.id) as count  from Follower flw
      GROUP BY flw.profileId
    ) follower On follower.profileId = pr.id
    WHERE id.id = '${id}'
    GROUP BY id.id
    `;
    const [data] = await this.profileModel.sequelize.query(query);

    return data[0];
  }

  // TODO Refactor all methods
  async getByUserNameOrAddress(userNameOrAddress: string, user?: IUserInterface['data']) {
    let address: string;
    let name: string;
    if (userNameOrAddress.substring(0, 2) === '0x') {
      address = userNameOrAddress;
    } else {
      name = userNameOrAddress;
    }
    const query = `
      SELECT DISTINCT id.*, bc.address, pr.name, 
      pr.avatar, pr.cover, pr.userName,
      pr.website, pr.socials, pr.email, pr.bio, pr.sections,
      pr.communityLink,
      IF(fl.id, 1, 0) as isFollowing,
      IF(fol.count, fol.count, 0) as followers,
      IF(follower.count, follower.count, 0) as followings
      FROM Identity id
      LEFT JOIN BlockchainIdentityAddress bc On bc.identityId = id.id
      LEFT JOIN Profile pr ON pr.id = id.profileID
      LEFT JOIN Follower fl On fl.profileId = '${user.profileId}' && fl.targetProfileId = pr.id 
      LEFT JOIN (
        SELECT flw.targetProfileId, count(flw.id) as count  from Follower flw
        GROUP BY flw.targetProfileId
      ) fol On fol.targetProfileId = pr.id
      LEFT JOIN (
        SELECT flw.profileId, count(flw.id) as count  from Follower flw
        GROUP BY flw.profileId
      ) follower On follower.profileId = pr.id
      ${address ? `WHERE bc.address = '${address}'` : `WHERE pr.userName = '${name}'`}
      GROUP BY id.id
      `;

    const [data] = await this.identityModel.sequelize.query(query);
    return {
      data: data[0],
    };
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

    await this.profileModel.update(
      {
        ...params,
        socials: typeof params.socials === 'string' ? JSON.parse(params.socials) : params.socials,
        sections:
          typeof params.sections === 'string' ? JSON.parse(params.sections) : params.sections,
      },
      { where: { id } },
    );
  }

  async getResourcesByProfileId(
    type: 'libraries' | 'podcasts' | 'news',
    profileId: number,
    limit?: number,
    offset?: number,
    viewerUser?: IUserInterface['data'] | null,
  ) {
    if (type === 'libraries') {
      return paginate(this.libraryModel, { where: { profileId }, limit, offset });
    }
    if (type === 'podcasts') {
      return paginate(this.podcastModel, { where: { profileId }, limit, offset });
    }
    if (type === 'news') {
      const paginatedData = await paginate(this.newsModel, { where: { profileId }, limit, offset });

      const listOfNewsLikesCount = await this.getAllNewsLikeCounts();
      let listOfAllNewsIdsLikedByUser: NewsModel[] = [];
      if (viewerUser.profileId) {
        listOfAllNewsIdsLikedByUser = await this.getAllNewsLikesListByProfileId(
          viewerUser.profileId,
        );
      }

      paginatedData.data = await Promise.all(
        paginatedData.data.map((news: NewsModel) =>
          this.injectLikesToNewsRecord(news, listOfNewsLikesCount, listOfAllNewsIdsLikedByUser),
        ),
      );

      return paginatedData;
    }
  }

  async followByProfileId(
    sourceProfileId: number,
    targetProfileId: number,
  ): Promise<{ success: boolean }> {
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

  async unFollowByProfileId(
    sourceProfileId: number,
    targetProfileId: number,
  ): Promise<{ success: boolean }> {
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
  async injectLikesToNewsRecord(
    newsRecord: any,
    listOfNewsLikesCount: any,
    listOfAllNewsIdsLikedByUser: any,
  ) {
    const result = newsRecord;
    result.isLiked = false;

    if (listOfAllNewsIdsLikedByUser) {
      result.isLiked = listOfAllNewsIdsLikedByUser.includes(newsRecord.dataValues.id);
    }

    result.likesCount = listOfNewsLikesCount[newsRecord.dataValues.id]
      ? listOfNewsLikesCount[newsRecord.dataValues.id]
      : 0;

    return result;
  }

  async getFollowList(
    type: 'followers' | 'followings',
    profileId: number,
    viewerUser?: IUserInterface['data'] | null,
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
              attributes: ['address', 'identityId'],
            },
          ],
        },
      ],
      limit,
      offset,
    });

    const listOfFollowersCount = await this.getAllFollowersCounts();
    let listOfAllProfileIdsFollowedByUser: number[] = [];
    if (viewerUser.profileId) {
      listOfAllProfileIdsFollowedByUser = await this.getAllFollowingsListByProfileId(
        viewerUser.profileId,
      );
    }

    result.data = await Promise.all(
      result.data.map((item: any) =>
        this.injectDataToFollowList(item, listOfFollowersCount, listOfAllProfileIdsFollowedByUser),
      ),
    );

    return result;
  }

  async injectDataToFollowList(
    profile: any,
    listOfFollowersCount: any,
    listOfAllProfileIdsFollowedByUser: number[],
  ) {
    profile.dataValues.followers = listOfFollowersCount[profile.dataValues.profileId]
      ? listOfFollowersCount[profile.dataValues.profileId]
      : 0;

    profile.dataValues.isFollower = false;
    if (listOfAllProfileIdsFollowedByUser) {
      profile.dataValues.isFollower = listOfAllProfileIdsFollowedByUser.includes(
        profile.dataValues.profileId,
      );
    }

    profile.dataValues.accountType = profile.identity.accountType;
    profile.dataValues.address = profile.identity.address[0].address;
    profile.dataValues.identityId = profile.identity.id;
    delete profile.dataValues.identity;

    return profile;
  }

  async processProfileData(profile: any, viewerUser?: IUserInterface['data']) {
    if (!profile) {
      throw new HttpException('PROFILE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    profile.dataValues.isPartner = profile.identity.accountType === ACCOUNT_TYPES.PARTNER;
    profile.dataValues.address = profile.identity.address[0].address;
    profile.dataValues.id = profile.identity.id;
    profile.dataValues.profileId = profile.id;
    delete profile.dataValues.identity;

    profile.dataValues.followersCount = await this.getFollowersCount(profile.id);
    profile.dataValues.followingCount = await this.getFollowingCount(profile.id);

    profile.dataValues.isFollower = false;
    if (viewerUser.profileId) {
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

  async getAllNewsLikeCounts() {
    const allCountsList: any[] = await this.newsLikeModel.findAll({
      attributes: ['newsId', 'profileId', [fn('COUNT', 'profileId'), 'likesCount']],
      group: ['newsId'],
    });

    let formattedCountsObject;
    if (allCountsList.length) {
      formattedCountsObject = {};
      allCountsList.forEach((item: any) => {
        formattedCountsObject[item.newsId] = item.dataValues.likesCount;
      });
    }

    return formattedCountsObject;
  }

  // get array containing all newsIds liked by current user
  async getAllNewsLikesListByProfileId(profileId: number) {
    return this.newsLikeModel
      .findAll({
        where: { profileId },
        attributes: ['newsId'],
      })
      .then((allNews: Pick<NewsLikeModel, 'newsId'>[]) =>
        allNews.map((newsRecord: Pick<NewsLikeModel, 'newsId'>) => newsRecord.newsId),
      );
  }
}
