/* eslint-disable no-loop-func */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NOTIFICATION_TYPES } from '@Common/enums';
import { FollowerModel, NotificationModel } from '@DB/models';
import { paginate } from '@Common/utils';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationModel)
    private notificationModel: typeof NotificationModel,
  ) {}

  async addNotification(profileId: number, type: NOTIFICATION_TYPES, params: Record<string, unknown>) {
    return this.notificationModel.create({ profileId, type, params });
  }

  // get all notifications for user, and mark all notifications as "read"
  async getUserNotifications(profileId: number, limit?: number, offset?: number) {
    const paginatedData = await paginate(this.notificationModel, {
      where: { profileId },
      limit,
      offset,
      attributes: ['id', 'type', 'params', 'isRead', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    await this.notificationModel.update({ isRead: true }, { where: { profileId, isRead: false } });

    return paginatedData;
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
    const allNotifications: Pick<NotificationModel, 'id'>[] = await this.notificationModel.findAll({
      where: { type, params },
      attributes: ['id'],
    });

    return allNotifications.map((notification: { id: number }) => notification.id);
  }
}
