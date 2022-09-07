import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel } from '@DB/interfaces';
import { Podcast } from '@DB/models';
import { CreatePodcastDto, EditPodcastDto } from './dtos';
import { PodcastService } from './podcast.service';

@Controller()
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Post()
  async create(@User() user: IIdentityModel, @Body() body: CreatePodcastDto): Promise<Podcast> {
    return this.podcastService.create(user.profileId, body);
  }

  @Patch(':id')
  async update(@Body() body: EditPodcastDto, @Param('id') id: number): Promise<{ success: true }> {
    return this.podcastService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ success: true }> {
    return this.podcastService.delete(id);
  }
}
