import { Module } from '@nestjs/common';
import { SecuritizeService } from './securitize.service';

@Module({
  imports: [],
  providers: [SecuritizeService],
  controllers: [],
  exports: [SecuritizeService],
})
export class SecuritizeModule {}
