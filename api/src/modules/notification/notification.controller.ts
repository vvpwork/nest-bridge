import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IProfileNewsResponseDto } from '@Modules/profile/dtos';
import { Public, User } from '@Common/decorators';
import { PaginationQueryDto } from '@Common/dto';
import { IUserInterface, IUserRequest } from '@Common/interfaces';
import { Response } from 'express';
import { NotificationService } from './notification.service';
import { ProfileService } from '@/modules';

@ApiTags('Notifications')
@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all notifications for authorized user',
    type: IProfileNewsResponseDto,
  })
  async getNews(@User() user: IUserInterface, @Query() query: PaginationQueryDto, @Res() res: Response) {
    return res.status(200).send({
      data: await this.notificationService.getUserNotifications(user.data.profileId, query.limit, query.offset),
    });
  }
}
