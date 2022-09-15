import { Body, Controller, Delete, Param, Patch, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { ILibraryModel } from '@DB/interfaces';
import { CreateLibraryDto, EditLibraryDto, ILibraryResponseDto } from '@Modules/library/dtos';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@Common/services/cloudinary.service';
import { IUserInterface } from '@Common/interfaces';
import { Response } from 'express';
import { LibraryService } from './library.service';

@ApiTags('Libraries')
@Controller()
export class LibraryController {
  private cloudinary: CloudinaryService;

  constructor(private readonly libraryService: LibraryService) {
    this.cloudinary = new CloudinaryService();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Library created successfully',
    type: ILibraryResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @User() user: IUserInterface,
    @Body() body: CreateLibraryDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    // upload images to cloudinary
    const image = await this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'image'));
    const imageUrl = image.url ? image.url : '';

    res.status(201).send({
      data: await this.libraryService.create({
        profileId: user.data.profileId,
        ...body,
        image: imageUrl,
      } as ILibraryModel),
    });
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'successfully edited library',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Body() body: EditLibraryDto,
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    const params: any = { ...body };
    // upload images to cloudinary
    const image = await this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'image'));

    if (image && image.url) {
      params.image = image.url;
    }

    res.status(200).send({
      data: await this.libraryService.update(id, params as ILibraryModel),
    });
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'successfully deleted',
  })
  async delete(@Param('id') id: string, @Res() res: Response) {
    res.status(200).send({
      data: await this.libraryService.delete(id),
    });
  }
}
