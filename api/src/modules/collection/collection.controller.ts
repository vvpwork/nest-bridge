import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Next,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Multer } from 'multer';
import { NextFunction, Response } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { InjectModel } from '@nestjs/sequelize';
import { CollectionModel } from '@/db/models';
import { ICollectionCreateDto } from './dtos/collection-create.dto';
import { CloudinaryService } from '@/common/services/cloudinary.service';
import { Public } from '@/common/decorators';

import { CollectionService } from './collection.service';
import { ICollectionQueryDto, ICollectionReadDto } from './dtos';
import { ICollectionModel } from '@/db/interfaces';

@ApiTags('Collection')
@Controller()
export class CollectionController {
  private cloudinary: CloudinaryService;

  constructor(
    @InjectModel(CollectionModel) private collection: typeof CollectionModel,
    private service: CollectionService,
  ) {
    this.cloudinary = new CloudinaryService();
  }

  @Public()
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  public async post(
    @Body() body: ICollectionCreateDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Next() next: NextFunction,
    @Res() res: Response,
  ) {
    try {
      const isExist = await this.service.findOne(body.id);

      if (isExist) return next(new HttpException('Collection is already exist', 409));

      // upload images to cloudinary
      const [cover, logo] = await Promise.allSettled([
        this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'cover')),
        this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'logo')),
      ]);
      const coverImage = cover.status === 'fulfilled' ? cover.value.url : '';
      const logoImage = logo.status === 'fulfilled' ? logo.value.url : '';

      const result = await this.service.create({ ...body, logo: logoImage, cover: coverImage } as ICollectionModel);

      return res.status(201).send({
        data: result,
      });
    } catch (err) {
      Logger.error(err);
      throw new Error(err);
    }
  }

  @Public()
  @Get(':id')
  public async getBuId(@Param() param: ICollectionReadDto, @Res() res: Response, @Next() next: NextFunction) {
    const result = await this.service.findOne(param.id);

    if (!result) return next(new HttpException('Collection was not found', 404));
    return res.status(200).send({
      data: result,
    });
  }

  @Public()
  @Get('')
  public async getAll(@Res() res: Response, @Next() next: NextFunction, @Query() query: ICollectionQueryDto) {
    try {
      const result = await this.service.findAll(query.identityId);
      res.status(200).send({
        data: result,
      });
    } catch (er) {
      Logger.error(er);
      throw er;
    }
  }
}
