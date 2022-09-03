import { Controller, Sse } from '@nestjs/common';
import { SseService } from './sse.service';

@Controller()
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse()
  doTheSse() {
    return this.sseService.sendEvents();
  }
}
