import { Module } from '@nestjs/common';

import { BlockchainModule } from '../blockchain';
import { SecuritizeService } from './securitize.service';

@Module({
  imports: [BlockchainModule],
  providers: [SecuritizeService],
  controllers: [],
  exports: [SecuritizeService],
})
export class SecuritizeModule {}
