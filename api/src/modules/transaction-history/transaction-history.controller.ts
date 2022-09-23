import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '@Common/decorators';
import { IUserInterface } from '@Common/interfaces';
import { Response } from 'express';

import { TransactionHistoryService } from '@Modules/transaction-history/transaction-history.service';
import { CreateTransactionDto } from '@Modules/transaction-history/dtos';

@ApiTags('Transactions')
@Controller()
export class TransactionHistoryController {
  constructor(private readonly transactionHistoryService: TransactionHistoryService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
  })
  async create(@User() user: IUserInterface, @Body() body: CreateTransactionDto, @Res() res: Response) {
    return res.status(201).send({
      data: await this.transactionHistoryService.create({
        identityId: user.data.id,
        address: user.data.address,
        ...body,
      }),
    });
  }
}
