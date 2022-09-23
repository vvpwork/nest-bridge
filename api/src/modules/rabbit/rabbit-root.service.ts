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

  async addCollectionEvent(data: { addresses: string[]; identityId: string }) {
    return this.rabbitInstance.getMessageProcessingResult({
      type: TypeRpcMessage.BLOCKCHAIN,
      command: TypeRpcCommand.ADD_COLLECTION,
      data,
    });
  }

  async handleMessage(message: string) {
    Logger.log(message);
    return 'ok';
  }
}
