import { Global, Module } from '@nestjs/common';
import { RabbitRootService } from './rabbit-root.service';

@Global()
@Module({
  providers: [RabbitRootService],
  exports: [RabbitRootService],
})
export class RabbitModule {}
