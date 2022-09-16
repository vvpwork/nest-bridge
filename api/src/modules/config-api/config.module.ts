import { Module } from '@nestjs/common';
import { ConfigApiController } from './config.controller';

@Module({
  imports: [],
  controllers: [ConfigApiController],
  providers: [],
})
export class ConfigApiModule {}
