import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators';
import { CreatorsService } from './creators.service';
import { ICreatorsResponse, ICretortsQueryDto } from './dtos/creators-getall.dto';

@ApiTags('Creators')
@Controller()
export class CreatorsController {
  constructor(private creatorsService: CreatorsService) {}

  @ApiResponse({
    type: ICreatorsResponse,
  })
  @Public()
  @Get()
  async findAll(@Res() res: Response, @Query() query: ICretortsQueryDto) {
    const result = await this.creatorsService.findAll(query);
    return res.status(200).send({
      ...result,
    });
  }
}
