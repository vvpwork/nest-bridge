import { Module } from '@nestjs/common';

import { ExampleController } from './controllers';
import { ExampleService } from './services';
// import { configuration } from './config/configuration.js'

@Module({
  imports: [],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}
