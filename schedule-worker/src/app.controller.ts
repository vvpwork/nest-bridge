import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BlockchainService } from './blockchain/blockchain.service';
import { RabbitRootService } from './rabbit/rabbit-root.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly blockChain: BlockchainService,
    private rabbitService: RabbitRootService,
  ) {}

  @Get()
  async getHealthCheck(): Promise<string> {
    return 'ok';
  }
}
