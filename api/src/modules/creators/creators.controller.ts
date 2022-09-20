import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators';
import { CreatorsService } from './creators.service';
import { ICreatorsResponse, ICretortsQueryDto } from './dtos/creators-getall.dto';
import { BlockchainService } from '../blockchain/blockchain.service';
import { RabbitRootService } from '../rabbit/rabbit-root.service';
import { IMessageRabbit } from '../rabbit/interfaces';
import { TypeRpcCommand, TypeRpcMessage } from '../rabbit/interfaces/enums';

@ApiTags('Creators')
@Controller()
export class CreatorsController {
  constructor(
    private creatorsService: CreatorsService,
    private bc: BlockchainService,
    private rabbit: RabbitRootService,
  ) {}

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

  @Public()
  @Get('rabbit')
  async testRabbit(@Res() res: Response) {
    const message: IMessageRabbit = {
      type: TypeRpcMessage.BLOCKCHAIN,
      command: TypeRpcCommand.ADD_COLLECTION,
      data: {
        collectionId: { collectionId: '0x8dcF19AeE31F9624FCe35F61037c80f2CA346467' },
      },
    };

    const result = await this.rabbit.getProcessResult(message);

    return res.send(result);
  }
}
