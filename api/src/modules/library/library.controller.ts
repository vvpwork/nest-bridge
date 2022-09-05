import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { User } from '@Common/decorators/user.decorator';
import { IIdentityModel } from '@Common/interfaces';
import { CreateLibraryDto, EditLibraryDto } from '@Modules/library/dtos/';
import { Library } from '@DB/models';
import { Public } from '@Common/decorators';
import { LibraryService } from './library.service';

@Controller()
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  // ToDo add auth guard
  // ToDo add middleware to allow only owner to perform this action
  @Public()
  @Post()
  create(@User() user: IIdentityModel, @Body() body: CreateLibraryDto): Promise<Library> {
    const mockUser = { id: 1, profileId: 1 }; // ToDo get user from request instead of mock
    return this.libraryService.create(mockUser.profileId, body);
  }

  // ToDo add middleware to allow only owner to perform this action
  // ToDo add auth guard
  @Patch(':id')
  update(@Body() body: EditLibraryDto, @Param('id') id: number): Promise<{ success: true }> {
    return this.libraryService.update(id, body);
  }

  // ToDo add middleware to allow only owner to perform this action
  // ToDo add auth guard
  @Delete(':id')
  delete(@Param('id') id: number): Promise<{ success: true }> {
    return this.libraryService.delete(id);
  }
}
