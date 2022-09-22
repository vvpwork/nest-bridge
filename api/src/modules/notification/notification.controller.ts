import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@Common/decorators';
import { PaginationQueryDto } from '@Common/dto';
import { IUserInterface } from '@Common/interfaces';
import { Response } from 'express';
import { IHaveUnreadNotificationsResponseDto, INotificationListResponseDto } from '@Modules/notification/dtos';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all notifications for authorized user',
    type: INotificationListResponseDto,
  })
  async getList(@User() user: IUserInterface, @Query() query: PaginationQueryDto, @Res() res: Response) {
    return res.status(200).send({
      data: await this.notificationService.getUserNotifications(user.data.profileId, query.limit, query.offset),
    });
  }

  @Get('haveUnread')
  @ApiResponse({
    status: 200,
    description: 'check if user have unread notifications',
    type: IHaveUnreadNotificationsResponseDto,
  })
  async haveUnread(@User() user: IUserInterface, @Res() res: Response) {
    return res.status(200).send({
      data: await this.notificationService.doesHaveUnreadNotifications(user.data.profileId),
    });
  }
}
