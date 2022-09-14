import { Body, Controller, Delete, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { ICollectionModel, IIdentityModel, ILibraryModel } from '@DB/interfaces';
import { CreateLibraryDto, EditLibraryDto } from '@Modules/library/dtos';
import { LibraryModel } from '@DB/models';
import { ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@Common/services/cloudinary.service';
import { IUserInterface } from '@Common/interfaces';
import { LibraryService } from './library.service';

@ApiTags('Libraries')
@Controller()
export class LibraryController {
  private cloudinary: CloudinaryService;

  constructor(private readonly libraryService: LibraryService) {
    this.cloudinary = new CloudinaryService();
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @User() user: IUserInterface,
    @Body() body: CreateLibraryDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<LibraryModel> {
    // upload images to cloudinary
    const image = await this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'image'));
    const imageUrl = image.url ? image.url : '';

    return this.libraryService.create({ profileId: user.data.profileId, ...body, image: imageUrl } as ILibraryModel);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Body() body: EditLibraryDto,
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<{ success: true }> {
    // upload images to cloudinary
    const image = await this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'image'));
    const imageUrl = image.url ? image.url : '';

    return this.libraryService.update(id, { ...body, image: imageUrl } as ILibraryModel);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: true }> {
    return this.libraryService.delete(id);
  }
}
