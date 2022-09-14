import { Body, Controller, Delete, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel, IPodcastModel } from '@DB/interfaces';
import { PodcastModel } from '@DB/models';
import { ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@Common/services/cloudinary.service';
import { IUserInterface } from '@Common/interfaces';
import { CreatePodcastDto, EditPodcastDto } from './dtos';
import { PodcastService } from './podcast.service';

@ApiTags('Podcasts')
@Controller()
export class PodcastController {
  private cloudinary: CloudinaryService;
  constructor(private readonly podcastService: PodcastService) {
    this.cloudinary = new CloudinaryService();
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @User() user: IUserInterface,
    @Body() body: CreatePodcastDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<PodcastModel> {
    const image = await this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'image'));
    const imageUrl = image.url ? image.url : '';

    // TODO use response.status().send()
    return this.podcastService.create({ profileId: user.data.profileId, ...body, image: imageUrl } as PodcastModel);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Body() body: EditPodcastDto,
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<{ success: true }> {
    // upload images to cloudinary
    const image = await this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'image'));
    const imageUrl = image.url ? image.url : '';

    return this.podcastService.update(id, { ...body, image: imageUrl } as IPodcastModel);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: true }> {
    return this.podcastService.delete(id);
  }
}
