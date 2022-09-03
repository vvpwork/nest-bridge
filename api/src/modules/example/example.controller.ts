import { Controller, Get, Post } from '@nestjs/common';
import { ExampleService } from './example.service';
import { Public } from '@/common/decorators';

@Controller()
export class ExampleController {
  constructor(private readonly appService: ExampleService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  postHello() {
    return 'Hello';
  }
}
