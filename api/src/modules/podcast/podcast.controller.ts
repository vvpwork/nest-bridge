import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel } from '@Common/interfaces';
import { Podcast } from '@DB/models';
import { CreatePodcastDto, EditPodcastDto } from './dtos';
import { PodcastService } from './podcast.service';

@Controller()
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  // ToDo add auth guard
  // ToDo add middleware to allow only owner to perform this action
  @Post()
  create(@User() user: IIdentityModel, @Body() body: CreatePodcastDto): Promise<Podcast> {
    const mockUser = { id: 1, profileId: 1 }; // ToDo get user from request instead of mock
    return this.podcastService.create(mockUser.profileId, body);
  }

  // ToDo add middleware to allow only owner to perform this action
  // ToDo add auth guard
  @Patch(':id')
  update(@Body() body: EditPodcastDto, @Param('id') id: number): Promise<{ success: true }> {
    return this.podcastService.update(id, body);
  }

  // ToDo add middleware to allow only owner to perform this action
  // ToDo add auth guard
  @Delete(':id')
  delete(@Param('id') id: number): Promise<{ success: true }> {
    return this.podcastService.delete(id);
  }
}
