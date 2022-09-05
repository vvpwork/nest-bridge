import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NOTIFICATION_TYPES } from '@Common/enums';
import { Follower, Notification } from '@DB/models';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {}

  async addNotification(profileId: number, type: NOTIFICATION_TYPES, params: Record<string, unknown>) {
    return this.notificationModel.create({ profileId, type, params });
  }

  async addNotificationToAllIdentityFollowers(profileId: number, params: Record<string, unknown>, type: NOTIFICATION_TYPES) {
    const allFollowers: Pick<Follower, 'profileId'>[] = await Follower.findAll({
      where: { targetProfileId: profileId },
      attributes: ['profileId'],
      raw: true,
    });

    while (allFollowers.length) {
      const toProcess = allFollowers.splice(0, 100);
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(toProcess.map((follower: Pick<Follower, 'profileId'>) => this.addNotification(follower.profileId, type, params)));
    }
  }

  async getAllNotificationIdsByTypeAndParams(params: any, type: NOTIFICATION_TYPES) {
    const allNotifications: Pick<Notification, 'id'>[] = await this.notificationModel.findAll({
      where: { type, params },
      attributes: ['id'],
    });

    return allNotifications.map((notification: { id: number }) => notification.id);
  }
}
