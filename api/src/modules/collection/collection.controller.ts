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
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Multer } from 'multer';
import { NextFunction, Response } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { InjectModel } from '@nestjs/sequelize';
import { CollectionModel } from '@/db/models';
import { ICollectionCreate, ICollectionCreateDto } from './dtos/collection-create.dto';
import { CloudinaryService } from '@/common/services/cloudinary.service';
import { Public, User } from '@/common/decorators';

import { CollectionService } from './collection.service';
import { ICollectionQueryDto, ICollectionReadDto, ICollectionResponse } from './dtos';
import { ICollectionModel } from '@/db/interfaces';
import { BlockchainService } from '../blockchain/blockchain.service';
import { RabbitRootService } from '../rabbit/rabbit-root.service';
import { TypeRpcCommand, TypeRpcMessage } from '../rabbit/interfaces/enums';
import { IUserInterface } from '@/common/interfaces';
import { getShortHash } from '@/common/utils/short-hash.utile';
import { TransactionHistoryService } from '../transaction-history/transaction-history.service';

@ApiTags('Collection')
@Controller()
export class CollectionController {
  private cloudinary: CloudinaryService;

  constructor(
    @InjectModel(CollectionModel) private collection: typeof CollectionModel,
    private bcService: BlockchainService,
    private service: CollectionService,
    private rabbit: RabbitRootService,
    private historyService: TransactionHistoryService,
  ) {
    this.cloudinary = new CloudinaryService();
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: { type: 'string' },
        outletId: { type: 'integer' },
        logo: {
          type: 'string',
          format: 'binary',
        },
        cover: {
          type: 'string',
          format: 'binary',
        },
        id: { type: 'string' },
        identityId: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        symbol: { type: 'string' },
        salt: { type: 'number' },
        chainId: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Collection was added',
    type: ICollectionCreate,
  })
  public async post(
    @Body() body: ICollectionCreateDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response,
    @User() user: IUserInterface,
  ) {
    if (!this.bcService.isEthAddress(body.id)) throw new HttpException('Address is not valid', 400);
    const isExist = await this.service.findOne(body.id);
    if (isExist) throw new HttpException('Collection is already exist', 409);

    // upload images to cloudinary
    const [cover, logo] = await Promise.allSettled([
      this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'cover')),
      this.cloudinary.uploadFile(files.find((v: Express.Multer.File) => v.fieldname === 'logo')),
    ]);
    const coverImage = cover.status === 'fulfilled' ? cover.value.url : '';
    const logoImage = logo.status === 'fulfilled' ? logo.value.url : '';

    const result = await this.service.create({
      ...body,
      logo: logoImage,
      cover: coverImage,
      identityId: user.data.id,
    } as ICollectionModel);

    // inform another service
    // await this.rabbit.getProcessResult({
    //   type: TypeRpcMessage.BLOCKCHAIN,
    //   command: TypeRpcCommand.ADD_COLLECTION,
    //   data: {
    //     addresses: [body.id],
    //   },
    // });

    return res.status(201).send({
      data: result,
    });
  }

  @Get(':id')
  public async getBuId(@Param() param: ICollectionReadDto, @User() user: IUserInterface, @Res() res: Response) {
    const result = await this.service.findOne(param.id);
    this.historyService.create({ identityId: user.data.id });
    if (!result) throw new HttpException('Collection was not found', 404);
    return res.status(200).send({
      data: result,
      hash: getShortHash(param.id, user.data.id),
    });
  }

  @Public()
  @ApiResponse({
    type: ICollectionResponse,
    isArray: true,
  })
  @Get()
  public async getAll(@Res() res: Response, @Query() query: ICollectionQueryDto) {
    const result = await this.service.findAll(query);
    res.status(200).send({
      ...result,
    });
  }
}
