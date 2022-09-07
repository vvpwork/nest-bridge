import { Module } from '@nestjs/common';
import { RabbitRootService } from './rabbit-root.service';

@Module({
  providers: [RabbitRootService],
})
export class RabbitModule {}
