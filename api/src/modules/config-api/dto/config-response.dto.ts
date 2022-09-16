import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

class ConfigResponseDto {
  @ApiProperty({
    type: String,
    example: '0xC1427014f22022F8983B2A0fC0c1cBF461aC4aD8',
  })
  securitizeRegistryContractAddress: string;

  @ApiProperty({
    type: String,
    example: '0xC1427014f22022F8983B2A0fC0c1cBF461aC4aD8',
  })
  erc1155BridgeTowerFactoryC2Address: string;

  @ApiProperty({
    type: String,
    example: '0xC1427014f22022F8983B2A0fC0c1cBF461aC4aD8',
  })
  exchangeV2ProxyAddress: string;

  @ApiProperty({
    type: String,
    example: '0xC1427014f22022F8983B2A0fC0c1cBF461aC4aD8',
  })
  transferProxyAddress: string;

  @ApiProperty({
    type: String,
    example: '0xC1427014f22022F8983B2A0fC0c1cBF461aC4aD8',
  })
  erc20TransferProxyAddress: string;
}

export class IConfigResponseDto {
  @ApiProperty({ type: () => ConfigResponseDto })
  data: ConfigResponseDto;
}
