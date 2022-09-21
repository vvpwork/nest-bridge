import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '@Common/decorators';
import { IUserInterface } from '@Common/interfaces';
import { Response } from 'express';

import { TransactionHistoryService } from '@Modules/transaction-history/transaction-history.service';
import { CreateTransactionDto } from '@Modules/transaction-history/dtos';
import { DashboardService } from '@Modules/dashboard/dashboard.service';
import { INftQueryDto } from '@Modules/nft/dtos';
import { IPortfolioQueryDto } from '@Modules/dashboard/dtos';

@ApiTags('Dashboard')
@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('portfolio')
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: null,
  })
  async getPortfolio(@User() user: IUserInterface, @Query() query: IPortfolioQueryDto, @Res() res: Response) {
    return res.status(200).send({
      data: await this.dashboardService.getPortfolio(user.data, query),
    });
  }
}
