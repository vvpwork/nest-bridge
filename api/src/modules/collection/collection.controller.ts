import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Next,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Multer } from 'multer';
import { Response } from 'express';
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
import { ICollectionUpdateDto, ICollectionUpdateParam } from './dtos/colllection-update.dto';

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
        logo: {
          type: 'string',
          format: 'binary',
        },
        cover: {
          type: 'string',
          format: 'binary',
        },
        id: { type: 'string' },

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
    const resFromWorker = await this.rabbit.getProcessResult({
      type: TypeRpcMessage.BLOCKCHAIN,
      command: TypeRpcCommand.ADD_COLLECTION,
      data: {
        addresses: [body.id],
        identityId: user.data.id,
      },
    });

    console.log(resFromWorker);

    return res.status(201).send({
      data: result,
    });
  }

  @ApiResponse({
    type: ICollectionResponse,
  })
  @Public()
  @Get(':id')
  public async getBuId(@Param() param: ICollectionReadDto, @User() user: IUserInterface, @Res() res: Response) {
    const result = await this.service.findAll({
      collectionId: param.id,
      limit: 0,
      offset: 0,
      search: '',
    });
    if (!result) throw new HttpException('Collection was not found', 404);
    return res.status(200).send({
      data: result.data[0],
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
    return res.status(200).send({
      ...result,
    });
  }

  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
        },
        cover: {
          type: 'string',
          format: 'binary',
        },
        description: { type: 'string' },
        masterAddress: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    type: ICollectionCreate,
  })
  @Patch(':id')
  public async updateCollection(
    @Res() res: Response,
    @Body() body: ICollectionUpdateDto,
    @User() user: IUserInterface,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param() param: ICollectionUpdateParam,
  ) {
    // TODO refactor
    const coverData = files.find((v: Express.Multer.File) => v.fieldname === 'cover');
    const logoData = files.find((v: Express.Multer.File) => v.fieldname === 'logo');

    const [cover, logo] = await Promise.allSettled([
      this.cloudinary.uploadFile(coverData),
      this.cloudinary.uploadFile(logoData),
    ]);

    const coverImage: any = cover.status === 'fulfilled' ? cover.value.url : coverData;
    const logoImage: any = logo.status === 'fulfilled' ? logo.value.url : logoData;

    const bodyData = { cover: coverImage, logo: logoImage, ...body };
    const result = await this.service.update(param.id, user.data.id, bodyData);
    return res.status(201).send({
      ...result,
    });
  }
}
