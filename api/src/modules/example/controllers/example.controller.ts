import { Controller, Get } from '@nestjs/common'
import { ExampleService } from '../services'

@Controller()
export class ExampleController {
  constructor(private readonly appService: ExampleService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
