import { LibraryEntity, NotificationEntity } from '@DB/models';
import { LIBRARY_REPOSITORY, NOTIFICATION_REPOSITORY } from '@Common/constants';

export const libraryProviders = [
  {
    provide: LIBRARY_REPOSITORY,
    useValue: LibraryEntity,
  },
  {
    provide: NOTIFICATION_REPOSITORY,
    useValue: NotificationEntity,
  },
];
