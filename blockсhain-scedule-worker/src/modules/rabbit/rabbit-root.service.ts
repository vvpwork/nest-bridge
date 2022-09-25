import { Injectable, Logger } from '@nestjs/common';
import { config } from '@/common/config';
import { BlockchainService } from '../blockchain/blockchain.service';
import { IMessageRabbit, IRabbitRootService } from './interfaces';
import { TypeRpcMessage } from './interfaces/enums';
import { RabbitService } from './services';

@Injectable()
export class RabbitRootService implements IRabbitRootService {
  private rabbitInstance: RabbitService;
  constructor(private bc: BlockchainService) {
    this.init();
  }

  async init() {
    this.rabbitInstance = await RabbitService.getInstance();
    this.rabbitInstance.handlerMessageFromRPC =
      this.handlerMessageFromRpc.bind(this);
    this.rabbitInstance.run();
  }

  // TODO add interfaces
  publish(message: any) {
    this.rabbitInstance.publishMessage(
      message,
      config.rabbit.exchangeNameDefault,
    );
  }

  private async handlerMessageFromRpc(message: string) {
    const mes: IMessageRabbit = JSON.parse(message);
    Logger.log(mes, 'RabbitService received message');
    switch (mes.type) {
      case TypeRpcMessage.BLOCKCHAIN:
        return this.bc.rabbit.handlerRpcMessage(mes.command, mes.data);
      default:
        return 'Type not found';
    }
  }
}
