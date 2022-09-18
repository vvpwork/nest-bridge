import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NotificationModel, PodcastModel } from '@DB/models';
import { NotificationService } from '@Modules/notification';
import { NOTIFICATION_TYPES } from '@DB/enums';
import { ProfileService } from '@Modules/profile';
import { InjectModel } from '@nestjs/sequelize';
import { IPodcastModel } from '@DB/interfaces';

@Injectable()
export class PodcastService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly profileService: ProfileService,
    @InjectModel(PodcastModel)
    private podcastModel: typeof PodcastModel,
    @InjectModel(NotificationModel)
    private notificationModel: typeof NotificationModel,
  ) {}

  async create(params: PodcastModel): Promise<PodcastModel> {
    const { image, source, title } = params;

    const newPodcastRecord = await this.podcastModel.create(params);

    await this.notificationService.addNotificationToAllIdentityFollowers(
      params.profileId,
      {
        id: newPodcastRecord.id,
        image,
        source,
        title,
        name: await this.profileService.getUserNameByProfileId(params.profileId),
      },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_LIBRARY,
    );
    return newPodcastRecord;
  }

  async update(podcastId: string, params: IPodcastModel): Promise<{ success: true }> {
    await this.podcastModel.update(params, { where: { id: podcastId } });

    const podcastRecord = await this.podcastModel.findByPk(podcastId);

    if (!podcastRecord) {
      throw new HttpException('PODCAST_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const allNotificationIds = await this.notificationService.getAllNotificationIdsByTypeAndParams(
      { id: podcastId },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_LIBRARY,
    );
    if (allNotificationIds.length) {
      const { id, title, image, source } = podcastRecord;
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

  async delete(podcastId: string): Promise<{ success: true }> {
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
