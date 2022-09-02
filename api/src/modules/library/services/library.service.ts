import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LibraryEntity, NotificationEntity } from '@DB/models';
import { NotificationService } from '@Modules/notification/services';
import { NOTIFICATION_TYPES } from '@Common/enums';
import { ProfileService } from '@Modules/profile/services';
import { EditLibraryDto } from '@Modules/library/dtos/editLibraryDto.dto';
import { CreateLibraryDto } from '@Modules/library/dtos/createLibraryDto.dto';
import { LIBRARY_REPOSITORY, NOTIFICATION_REPOSITORY } from '@Common/constants';

@Injectable()
export class LibraryService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly profileService: ProfileService,
    @Inject(LIBRARY_REPOSITORY)
    private libraryModel: typeof LibraryEntity,
    @Inject(NOTIFICATION_REPOSITORY)
    private notificationModel: typeof NotificationEntity,
  ) {}

  async create(profileId: number, params: CreateLibraryDto): Promise<LibraryEntity> {
    const { image, source, title } = params;

    const newLibraryRecord = await this.libraryModel.create({ profileId, image, source, title });

    await this.notificationService.addNotificationToAllIdentityFollowers(
      profileId,
      {
        id: newLibraryRecord.id,
        image,
        source,
        title,
        name: await this.profileService.getUserNameByProfileId(profileId),
      },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_LIBRARY,
    );
    return newLibraryRecord;
  }

  async update(libraryId: number, params: EditLibraryDto): Promise<{ success: true }> {
    // eslint-disable-next-line @typescript-eslint/typedef,no-param-reassign
    Object.keys(params).forEach(key => (params[key] === undefined || params[key] === null ? delete params[key] : {}));

    await LibraryEntity.update(params, { where: { id: libraryId } });

    const newLibraryRecord = await LibraryEntity.findByPk(libraryId);

    const allNotificationIds = await this.notificationService.getAllNotificationIdsByTypeAndParams(
      { id: libraryId },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_LIBRARY,
    );
    if (allNotificationIds.length) {
      const { id, title, image, source } = newLibraryRecord;
      await NotificationEntity.update(
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
    const libraryRecord = await LibraryEntity.findByPk(libraryId, { attributes: ['id'] });
    if (!libraryRecord) {
      throw new HttpException('LIBRARY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await libraryRecord.destroy();

    const allNotificationIds: number[] = await this.notificationService.getAllNotificationIdsByTypeAndParams(
      { id: libraryId },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_LIBRARY,
    );

    if (allNotificationIds.length) {
      await this.notificationModel.destroy({ where: { id: allNotificationIds } });
    }

    return { success: true };
  }
}
