import { Injectable, Logger } from '@nestjs/common';
import { IMessageRabbit } from './interfaces';
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

  async getProcessResult(message: IMessageRabbit) {
    return this.rabbitInstance.getMessageProcessingResult(message);
  }

  async handleMessage(message: string) {
    Logger.log(message);
    return 'ok';
  }
}
