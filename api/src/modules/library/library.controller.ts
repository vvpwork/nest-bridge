import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel } from '@DB/interfaces';
import { CreateLibraryDto, EditLibraryDto } from '@Modules/library/dtos';
import { Library } from '@DB/models';
import { LibraryService } from './library.service';

@Controller()
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post()
  async create(@User() user: IIdentityModel, @Body() body: CreateLibraryDto): Promise<Library> {
    return this.libraryService.create(user.profileId, body);
  }

  @Patch(':id')
  async update(@Body() body: EditLibraryDto, @Param('id') id: number): Promise<{ success: true }> {
    return this.libraryService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ success: true }> {
    return this.libraryService.delete(id);
  }
}
