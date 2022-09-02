import { FollowerEntity, NotificationEntity } from '@DB/models';
import { FOLLOWER_REPOSITORY, NOTIFICATION_REPOSITORY } from '@Common/constants';

export const notificationProviders = [
  {
    provide: NOTIFICATION_REPOSITORY,
    useValue: NotificationEntity,
  },
  {
    provide: FOLLOWER_REPOSITORY,
    useValue: FollowerEntity,
  },
];
