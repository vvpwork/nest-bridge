import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NOTIFICATION_TYPES } from '@Common/enums';
import { FollowerEntity, NotificationEntity } from '@DB/models';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationEntity)
    private notificationModel: typeof NotificationEntity,
  ) {}

  async addNotification(profileId: number, type: NOTIFICATION_TYPES, params: Record<string, unknown>) {
    return this.notificationModel.create({ profileId, type, params });
  }

  async addNotificationToAllIdentityFollowers(profileId: number, params: Record<string, unknown>, type: NOTIFICATION_TYPES) {
    const allFollowers: Pick<FollowerEntity, 'profileId'>[] = await FollowerEntity.findAll({
      where: { targetProfileId: profileId },
      attributes: ['profileId'],
      raw: true,
    });

    while (allFollowers.length) {
      const toProcess = allFollowers.splice(0, 100);
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        toProcess.map((follower: Pick<FollowerEntity, 'profileId'>) => this.addNotification(follower.profileId, type, params)),
      );
    }
  }

  async getAllNotificationIdsByTypeAndParams(params: any, type: NOTIFICATION_TYPES) {
    const allNotifications: Pick<NotificationEntity, 'id'>[] = await this.notificationModel.findAll({
      where: { type, params },
      attributes: ['id'],
    });

    return allNotifications.map((notification: { id: number }) => notification.id);
  }
}
