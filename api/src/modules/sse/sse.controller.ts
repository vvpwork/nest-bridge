import { Controller, Sse } from '@nestjs/common';
import { Public } from '@/common/decorators';
import { SseService } from './sse.service';

@Controller()
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse()
  @Public()
  doTheSse() {
    return this.sseService.sendEvents();
  }
}
