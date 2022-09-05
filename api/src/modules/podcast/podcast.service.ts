import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Notification, Podcast } from '@DB/models';
import { NotificationService } from '@Modules/notification';
import { NOTIFICATION_TYPES } from '@Common/enums';
import { ProfileService } from '@Modules/profile';
import { InjectModel } from '@nestjs/sequelize';
import { EditPodcastDto, CreatePodcastDto } from './dtos';

@Injectable()
export class PodcastService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly profileService: ProfileService,
    @InjectModel(Podcast)
    private podcastModel: typeof Podcast,
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {}

  async create(profileId: number, params: CreatePodcastDto): Promise<Podcast> {
    const { image, source, title } = params;

    const newPodcastRecord = await this.podcastModel.create({ profileId, image, source, title });

    await this.notificationService.addNotificationToAllIdentityFollowers(
      profileId,
      {
        id: newPodcastRecord.id,
        image,
        source,
        title,
        name: await this.profileService.getUserNameByProfileId(profileId),
      },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_LIBRARY,
    );
    return newPodcastRecord;
  }

  async update(podcastId: number, params: EditPodcastDto): Promise<{ success: true }> {
    await this.podcastModel.update(params, { where: { id: podcastId } });

    const newPodcastRecord = await this.podcastModel.findByPk(podcastId);

    const allNotificationIds = await this.notificationService.getAllNotificationIdsByTypeAndParams(
      { id: podcastId },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_LIBRARY,
    );
    if (allNotificationIds.length) {
      const { id, title, image, source } = newPodcastRecord;
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

  async delete(podcastId: number): Promise<{ success: true }> {
    const podcastRecord = await this.podcastModel.findByPk(podcastId, { attributes: ['id'] });
    if (!podcastRecord) {
      throw new HttpException('PODCAST_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await podcastRecord.destroy();

    const allNotificationIds: number[] = await this.notificationService.getAllNotificationIdsByTypeAndParams(
      { id: podcastId },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_PODCAST,
    );

    if (allNotificationIds.length) {
      await this.notificationModel.destroy({ where: { id: allNotificationIds } });
    }

    return { success: true };
  }
}
