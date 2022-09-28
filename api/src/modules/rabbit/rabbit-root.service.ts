import { Injectable, Logger } from '@nestjs/common';
import { TypeSseMessage } from '../sse/enums';
import { SseService } from '../sse/sse.service';
import { TypeRpcCommand, TypeRpcMessage } from './interfaces/enums';
import { RabbitService } from './services';

@Injectable()
export class RabbitRootService {
  private rabbitInstance: RabbitService;
  private sseService: SseService;
  constructor() {
    this.init();
  }

  async init() {
    this.rabbitInstance = await RabbitService.getInstance();
    this.rabbitInstance.handlerMessageFromRPC = this.handleMessage.bind(this);
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
    const mes = JSON.parse(message);
    this.sseService.addEvent({ type: TypeSseMessage.NOTIFICATION, data: { mes } });
    return 'ok';
  }
}
