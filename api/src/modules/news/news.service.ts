import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { NewsModel, NewsLikeModel, NotificationModel } from '@DB/models';
import { NotificationService } from '@Modules/notification';
import { NOTIFICATION_TYPES } from '@DB/enums';
import { ProfileService } from '@Modules/profile';
import { InjectModel } from '@nestjs/sequelize';

import { IIdentityModel, INewsModel } from '@DB/interfaces';

@Injectable()
export class NewsService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly profileService: ProfileService,
    @InjectModel(NewsModel)
    private newsModel: typeof NewsModel,
    @InjectModel(NotificationModel)
    private notificationModel: typeof NotificationModel,
    @InjectModel(NewsLikeModel)
    private newsLikeModel: typeof NewsLikeModel,
  ) {}

  async create(params: INewsModel): Promise<NewsModel> {
    const newNewsRecord = await this.newsModel.create(params);

    // TODO fixed notification
    try {
      await this.notificationService.addNotificationToAllIdentityFollowers(
        params.profileId,
        {
          id: newNewsRecord.id,
          ...params,
          name: await this.profileService.getUserNameByProfileId(params.profileId),
        },
        NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_NEWS,
      );
    } catch (err) {
      Logger.error(err, 'NewService add notification');
    }
    return newNewsRecord;
  }

  async update(newsId: string, params: INewsModel): Promise<{ success: true }> {
    await this.newsModel.update(params, { where: { id: newsId } });

    const newsRecord = await this.newsModel.findByPk(newsId);

    if (!newsRecord) {
      throw new HttpException('NEWS_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const allNotificationIds = await this.notificationService.getAllNotificationIdsByTypeAndParams(
      { id: newsId },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_NEWS,
    );
    if (allNotificationIds.length) {
      const { id, title, image, source } = newsRecord;
      await this.notificationModel.update(
        {
          params: {
            id,
            title,
            image,
            source,
          },
        },
        { where: { id: allNotificationIds } },
      );
    }
    return { success: true };
  }

  async delete(libraryId: string): Promise<{ success: true }> {
    const newsRecord = await this.newsModel.findByPk(libraryId, { attributes: ['id'] });
    if (!newsRecord) {
      throw new HttpException('NEWS_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await newsRecord.destroy();

    const allNotificationIds: number[] =
      await this.notificationService.getAllNotificationIdsByTypeAndParams(
        { id: libraryId },
        NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_NEWS,
      );

    if (allNotificationIds.length) {
      await this.notificationModel.destroy({ where: { id: allNotificationIds } });
    }

    return { success: true };
  }

  async getOneById(id: string, viewerUser?: IIdentityModel | null) {
    const newsRecord = await this.newsModel.findByPk(id);
    if (!newsRecord) {
      throw new HttpException('NEWS_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return this.injectLikesToNewsRecord(newsRecord, viewerUser);
  }

  async likeById(newsId: string, profileId: number): Promise<void> {
    const alreadyExists = await this.newsLikeModel.findOne({
      where: { newsId, profileId },
      attributes: ['id'],
      raw: true,
    });

    if (alreadyExists) {
      throw new HttpException('ALREADY_LIKED', HttpStatus.BAD_REQUEST);
    }

    await this.newsLikeModel.create({ newsId, profileId });
  }

  async unLikeById(newsId: string, profileId: number): Promise<void> {
    const likeRecord = await this.newsLikeModel.findOne({
      where: { newsId, profileId },
      attributes: ['id'],
    });

    if (!likeRecord) {
      throw new HttpException('NOT_LIKED_YET', HttpStatus.BAD_REQUEST);
    }

    await likeRecord.destroy();
  }

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
}
