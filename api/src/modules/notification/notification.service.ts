/* eslint-disable no-loop-func */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NOTIFICATION_TYPES } from '@Common/enums';
import { FollowerModel, NotificationModel } from '@DB/models';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationModel)
    private notification: typeof NotificationModel,
  ) {}

  async addNotification(profileId: number, type: NOTIFICATION_TYPES, params: Record<string, unknown>) {
    return this.notification.create({ profileId, type, params });
  }

  async addNotificationToAllIdentityFollowers(
    profileId: number,
    params: Record<string, unknown>,
    type: NOTIFICATION_TYPES,
  ) {
    const allFollowers: Pick<FollowerModel, 'profileId'>[] = await FollowerModel.findAll({
      where: { targetProfileId: profileId },
      attributes: ['profileId'],
      raw: true,
    });

    while (allFollowers.length) {
      const toProcess = allFollowers.splice(0, 100);
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        toProcess.map((follower: Pick<FollowerModel, 'profileId'>) =>
          this.addNotification(+follower.profileId, type, params),
        ),
      );
    }
  }

  async getAllNotificationIdsByTypeAndParams(params: any, type: NOTIFICATION_TYPES) {
    const allNotifications: Pick<NotificationModel, 'id'>[] = await this.notification.findAll({
      where: { type, params },
      attributes: ['id'],
    });

    return allNotifications.map((notification: { id: number }) => notification.id);
  }
}
