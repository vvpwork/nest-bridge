import { Controller, Get, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IConfigResponseDto } from '@Modules/config-api/dto/';
import { config } from '@/common/config';
import { Public } from '@/common/decorators';

@ApiTags('Config')
@Controller()
export class ConfigApiController {
  @Get()
  @Public()
  @ApiResponse({
    status: 200,
    description: 'config',
    type: IConfigResponseDto,
  })
  async getConfig(@Res() res: Response) {
    return res.status(200).send({
      data: {
        securitizeRegistryContractAddress: config.securitize.proxyAddress,
        erc1155BridgeTowerFactoryC2Address: config.blockChain.erc1155proxyC2,
        exchangeV2ProxyAddress: config.blockChain.exchangeV2Proxy,
        transferProxyAddress: config.blockChain.transferProxy,
        erc20TransferProxyAddress: config.blockChain.erc20proxy,
        structuredStakingProxy: config.blockChain.structuredStakingProxy,
      },
    });
  }
}
