import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LibraryModel, NotificationModel } from '@DB/models';
import { NotificationService } from '@Modules/notification';
import { NOTIFICATION_TYPES } from '@Common/enums';
import { ProfileService } from '@Modules/profile';
import { InjectModel } from '@nestjs/sequelize';
import { ILibraryModel } from '@DB/interfaces';

@Injectable()
export class LibraryService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly profileService: ProfileService,
    @InjectModel(LibraryModel)
    private libraryModel: typeof LibraryModel,
    @InjectModel(NotificationModel)
    private notificationModel: typeof NotificationModel,
  ) {}

  async create(params: ILibraryModel): Promise<LibraryModel> {
    const newLibraryRecord = await this.libraryModel.create(params);

    await this.notificationService.addNotificationToAllIdentityFollowers(
      params.profileId,
      {
        id: newLibraryRecord.id,
        ...params,
        name: await this.profileService.getUserNameByProfileId(params.profileId),
      },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_LIBRARY,
    );

    return newLibraryRecord;
  }

  async update(libraryId: string, params: ILibraryModel): Promise<{ success: true }> {
    await this.libraryModel.update(params, { where: { id: libraryId } });

    const libraryRecord = await this.libraryModel.findByPk(libraryId);

    if (!libraryRecord) {
      throw new HttpException('LIBRARY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const allNotificationIds = await this.notificationService.getAllNotificationIdsByTypeAndParams(
      { id: libraryId },
      NOTIFICATION_TYPES.FOLLOWING_PERSON_ADDED_LIBRARY,
    );
    if (allNotificationIds.length) {
      const { id, title, image, source } = libraryRecord;
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

  async delete(libraryId: string): Promise<{ success: true }> {
    const libraryRecord = await this.libraryModel.findByPk(libraryId, { attributes: ['id'] });
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
