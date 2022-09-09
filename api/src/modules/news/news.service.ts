import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IdentityModel, NewsModel, NewsLikeModel, NotificationModel } from '@DB/models';
import { NotificationService } from '@Modules/notification';
import { NOTIFICATION_TYPES } from '@Common/enums';
import { ProfileService } from '@Modules/profile';
import { InjectModel } from '@nestjs/sequelize';

import { EditNewsDto, CreateNewsDto } from './dtos';

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

  async create(profileId: number, params: CreateNewsDto): Promise<NewsModel> {
    const { image, source, title } = params;

    const newNewsRecord = await this.newsModel.create({ profileId, image, source, title });

    await this.notificationService.addNotificationToAllIdentityFollowers(
      profileId,
      {
        id: newNewsRecord.id,
        image,
        source,
        title,
        name: await this.profileService.getUserNameByProfileId(profileId),
      },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_LIBRARY,
    );
    return newNewsRecord;
  }

  async update(libraryId: number, params: EditNewsDto): Promise<{ success: true }> {
    await this.newsModel.update(params, { where: { id: libraryId } });

    const newsRecord = await this.newsModel.findByPk(libraryId);

    if (!newsRecord) {
      throw new HttpException('NEWS_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const allNotificationIds = await this.notificationService.getAllNotificationIdsByTypeAndParams(
      { id: libraryId },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_LIBRARY,
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

  async delete(libraryId: number): Promise<{ success: true }> {
    const newsRecord = await this.newsModel.findByPk(libraryId, { attributes: ['id'] });
    if (!newsRecord) {
      throw new HttpException('NEWS_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await newsRecord.destroy();

    const allNotificationIds: number[] = await this.notificationService.getAllNotificationIdsByTypeAndParams(
      { id: libraryId },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_LIBRARY,
    );

    if (allNotificationIds.length) {
      await this.notificationModel.destroy({ where: { id: allNotificationIds } });
    }

    return { success: true };
  }

  async getOneById(id: string, viewerUser: IdentityModel | null) {
    const newsRecord = await this.newsModel.findByPk(id);
    if (!newsRecord) {
      throw new HttpException('NEWS_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return this.injectLikesToNewsRecord(newsRecord, viewerUser);
  }

  async injectLikesToNewsRecord(newsRecord: NewsModel, viewerUser: IdentityModel) {
    const result = newsRecord;
    result.isLiked = false;

    result.likesCount = await this.getLikesCount(newsRecord.id);

    if (viewerUser) {
      result.isLiked = await this.isLiked(newsRecord.id, +viewerUser.profileId);
    }

    return newsRecord;
  }

  async getLikesCount(newsId: string) {
    return this.newsLikeModel.count({
      where: { newsId },
    });
  }

  async isLiked(newsId: string, profileId: number) {
    const newsLikeRecord = await this.newsLikeModel.findOne({
      where: { newsId, profileId },
      attributes: ['id'],
      raw: true,
    });
    return !!newsLikeRecord;
  }
}
