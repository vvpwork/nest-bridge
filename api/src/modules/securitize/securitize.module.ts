import { Module } from '@nestjs/common';

import { BlockchainModule } from '../blockchain';
import { SecuritizeController } from './securitize.controller';
import { SecuritizeService } from './securitize.service';
import { IdentityModule } from '../identity';

@Module({
  imports: [BlockchainModule, IdentityModule],
  providers: [SecuritizeService],
  controllers: [SecuritizeController],
  exports: [SecuritizeService],
})
export class SecuritizeModule {}
