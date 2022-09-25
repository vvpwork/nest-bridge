import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '@Common/decorators';
import { IUserInterface } from '@Common/interfaces';
import { Response } from 'express';

import { TransactionHistoryService } from '@Modules/transaction-history/transaction-history.service';
import {
  CreateTransactionDto,
  INftHistoryByUSDC,
  INftPnlHistory,
} from '@Modules/transaction-history/dtos';
import { isArray } from 'class-validator';
import { IGetStakeHistoryQuery, IGetStakeHistoryResponse } from './dtos/get-stakedhistory.dto';

@ApiTags('Transactions')
@Controller()
export class TransactionHistoryController {
  constructor(private readonly transactionHistoryService: TransactionHistoryService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
  })
  async create(
    @User() user: IUserInterface,
    @Body() body: CreateTransactionDto,
    @Res() res: Response,
  ) {
    return res.status(201).send({
      data: await this.transactionHistoryService.create({
        identityId: user.data.id,
        address: user.data.address,
        ...body,
      }),
    });
  }

  @ApiResponse({
    status: 200,
    type: INftHistoryByUSDC,
  })
  @Get('nft')
  async nftHistory(@Res() res: Response, @User() user: IUserInterface) {
    res.status(200).send({
      data: await this.transactionHistoryService.geNftHistoryAmountByUSDC(user.data),
    });
  }

  @ApiResponse({
    status: 200,
    type: IGetStakeHistoryResponse,
    isArray: true,
  })
  @Get('stake')
  async getStakedHistory(
    @Res() res: Response,
    @User() user: IUserInterface,
    @Query() query: IGetStakeHistoryQuery,
  ) {
    const result = await this.transactionHistoryService.getStakedHistory(user.data, query);
    return res.status(200).send({
      ...result,
    });
  }

  @ApiResponse({
    status: 200,
    type: INftPnlHistory,
  })
  @Get('pnl')
  async getPnlHistory(@Res() res: Response, @User() user: IUserInterface) {
    return res.status(200).send({
      data: await this.transactionHistoryService.getPnlHistory(user.data),
    });
  }
}
