import { Injectable, Logger } from '@nestjs/common';
import { IMessageRabbit } from './interfaces';
import { TypeRpcCommand, TypeRpcMessage } from './interfaces/enums';
import { RabbitService } from './services';

@Injectable()
export class RabbitRootService {
  private rabbitInstance: RabbitService;
  constructor() {
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

  handleMessage = async (message: string) => {
    const mes: IMessageRabbit = JSON.parse(message);

    switch (mes.type) {
      case TypeRpcMessage.BLOCKCHAIN:
        return this.blockchainHandler(mes.command, mes.data);

      default:
        return 'Type not found';
    }
  };

  async blockchainHandler(command: TypeRpcCommand, data: any) {
    return Promise.resolve('blockchain');
  }
}
