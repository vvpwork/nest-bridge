import { IsEnum, IsNumber, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionDataDto } from '@Modules/transaction-history/dtos/transaction-data.dto';
import { ApiProperty } from '@nestjs/swagger';
/**
 * https://github.com/typestack/class-validator#validation-decorators
 * https://docs.nestjs.com/techniques/serialization
 */

export class BlockchainAmountAndPriceObject {
  @ApiProperty({
    type: String,
    example: '246246666',
  })
  value: string;

  @ApiProperty({
    type: Number,
    example: 333,
  })
  amount: number;
}

export class NftTotalsResponseDto {
  @ApiProperty({
    type: Object,
    example: {
      value: {
        Fuji: {
          price: 246246666,
          amount: 200,
        },
      },
      worth: {
        Fuji: {
          amount: 20,
          value: 10000000,
        },
      },
    },
  })
  data: {
    // @ApiProperty({
    //   type: Object,
    // })
    // @Type(() => BlockchainAmountAndPriceObject)
    value: BlockchainAmountAndPriceObject;
  };
}
//
// @Type(() => IOnSalesData)
// @ValidateNested()
// onSalesData: IOnSalesData[] | null;
