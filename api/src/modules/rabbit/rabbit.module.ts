import { Global, Module } from '@nestjs/common';
import { SseModule } from '../sse/sse.module';
import { RabbitRootService } from './rabbit-root.service';

@Global()
@Module({
  imports: [SseModule],
  providers: [RabbitRootService],
  exports: [RabbitRootService],
})
export class RabbitModule {}
