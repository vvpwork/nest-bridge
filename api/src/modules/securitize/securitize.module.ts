import { Module } from '@nestjs/common';

import { BlockchainModule } from '../blockchain';
import { SecuritizeController } from './securitize.controller';
import { SecuritizeService } from './securitize.service';

@Module({
  imports: [BlockchainModule],
  providers: [SecuritizeService],
  controllers: [SecuritizeController],
  exports: [SecuritizeService],
})
export class SecuritizeModule {}
