import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Identity, News, NewsLike, Notification } from '@DB/models';
import { NotificationService } from '@Modules/notification';
import { NOTIFICATION_TYPES } from '@Common/enums';
import { ProfileService } from '@Modules/profile';
import { InjectModel } from '@nestjs/sequelize';
import { IIdentityModel, INewsModel } from '@DB/interfaces';
import { JwtService } from '@nestjs/jwt';
import { EditNewsDto, CreateNewsDto } from './dtos';

@Injectable()
export class NewsService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly profileService: ProfileService,
    @InjectModel(News)
    private newsModel: typeof News,
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
    @InjectModel(NewsLike)
    private newsLikeModel: typeof NewsLike,
  ) {}

  async create(profileId: number, params: CreateNewsDto): Promise<News> {
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

  async getOneById(id: string, viewerUser: Identity | null) {
    const newsRecord = await this.newsModel.findByPk(id);
    if (!newsRecord) {
      throw new HttpException('NEWS_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return this.injectLikesToNewsRecord(newsRecord, viewerUser);
  }

  async injectLikesToNewsRecord(newsRecord: News, viewerUser: Identity) {
    const result = newsRecord;
    result.isLiked = false;

    result.likesCount = await this.getLikesCount(newsRecord.id);

    if (viewerUser) {
      result.isLiked = await this.isLiked(newsRecord.id, viewerUser.profileId);
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
