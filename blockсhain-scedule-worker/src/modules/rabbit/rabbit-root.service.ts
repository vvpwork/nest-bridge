import { Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';
import { IMessageRabbit } from './interfaces';
import { TypeRpcCommand, TypeRpcMessage } from './interfaces/enums';
import { RabbitService } from './services';

// TODO add logic working with rpc
@Injectable()
export class RabbitRootService {
  private rabbitInstance: RabbitService;
  constructor(private bc: BlockchainService) {
    this.init();
  }

  async init() {
    this.rabbitInstance = await RabbitService.getInstance();
    this.rabbitInstance.handlerMessageFromRPC = this.handleMessage;
    this.rabbitInstance.run();
  }

  publish() {
    this.rabbitInstance.publishMessage(
      '************ its work ********',
      'default_exchange',
    );
  }

  handleMessage: any = async (message: string) => {
    const mes: IMessageRabbit = JSON.parse(message);
    console.log(mes);

    switch (mes.type) {
      case TypeRpcMessage.BLOCKCHAIN:
        return this.bc.rabbit.handlerMessage(mes.command, mes.data);

      default:
        return 'Type not found';
    }
  };
}
