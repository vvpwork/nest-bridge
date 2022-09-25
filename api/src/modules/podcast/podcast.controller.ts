import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IPodcastModel } from '@DB/interfaces';
import { PodcastModel } from '@DB/models';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@Common/services/cloudinary.service';
import { IUserInterface } from '@Common/interfaces';
import { Response } from 'express';
import { ILibraryResponseDto } from '@Modules/library/dtos';
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
  @ApiResponse({
    status: 201,
    description: 'Podcast created successfully',
    type: ILibraryResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  async create(
    @User() user: IUserInterface,
    @Body() body: CreatePodcastDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    const image = await this.cloudinary.uploadFile(
      files.find((v: Express.Multer.File) => v.fieldname === 'image'),
    );
    const imageUrl = image.url ? image.url : '';

    return res.status(201).send({
      data: await this.podcastService.create({
        profileId: user.data.profileId,
        ...body,
        image: imageUrl,
      } as PodcastModel),
    });
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiResponse({
    status: 200,
    description: 'successfully edited podcast',
  })
  @ApiConsumes('multipart/form-data')
  async update(
    @Body() body: EditPodcastDto,
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    const params: any = { ...body };

    if (!body.image) {
      const image = await this.cloudinary.uploadFile(
        files.find((v: Express.Multer.File) => v.fieldname === 'image'),
      );
      if (image && image.url) {
        params.image = image.url;
      }
    }

    return res.status(201).send({
      data: await this.podcastService.update(id, params as IPodcastModel),
    });
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'successfully deleted',
  })
  async delete(@Param('id') id: string, @Res() res: Response) {
    return res.status(201).send({
      data: await this.podcastService.delete(id),
    });
  }
}
