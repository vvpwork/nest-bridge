import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '@Common/decorators';
import { IUserInterface } from '@Common/interfaces';
import { Response } from 'express';

import { DashboardService } from '@Modules/dashboard/dashboard.service';
import { IPortfolioQueryDto, IPortfolioResponseDto } from '@Modules/dashboard/dtos';

@ApiTags('Dashboard')
@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('portfolio')
  @ApiResponse({
    status: 200,
    description: 'Get list of portfolio assets',
    type: IPortfolioResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async getPortfolio(@User() user: IUserInterface, @Query() query: IPortfolioQueryDto, @Res() res: Response) {
    return res.status(200).send({
      data: await this.dashboardService.getPortfolio(user.data, query),
    });
  }

  @Get('stats')
  @ApiResponse({
    status: 200,
    description: 'Get stats for dashboard page',
    type: null, // ToDo add response dto
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async getStats(@User() user: IUserInterface, @Res() res: Response) {
    return res.status(200).send({
      data: await this.dashboardService.getStats(user.data),
    });
  }
}
