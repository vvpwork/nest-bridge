import { Module } from '@nestjs/common';
import { RabbitRootService } from './rabbit-root.service';

@Module({
  providers: [RabbitRootService],
  exports: [RabbitRootService],
})
export class RabbitModule {}
