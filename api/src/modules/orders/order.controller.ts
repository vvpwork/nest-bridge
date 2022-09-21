import { Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { IUserInterface, IUserRequest } from '@/common/interfaces';
import { User } from '@/common/decorators';
import { ICreateOrderDto, ICreateOrderResponseDto } from './dtos/order-create.dto';
import { OrderService } from './order.service';
import { IUpdateOrderDto, IUpdateOrderResponseDto } from './dtos/update-order.dto';
import { TransactionHistoryService } from '../transaction-history/transaction-history.service';
import { IBuyOrderRequest } from './dtos/buy-order.dto';
import { IDeleteOrderParam, IDeleteOrderQuery } from './dtos/delete-order.dto';

@ApiTags('Orders')
@Controller()
export class OrderController {
  constructor(private orderService: OrderService, private historyService: TransactionHistoryService) {}

  @ApiResponse({
    status: 200,
    description: 'returned order',
    type: ICreateOrderResponseDto,
  })
  @Get(':id')
  async findOne(@Res() res: Response, @Param() param: { id: string }) {
    const result = await this.orderService.findOne(param.id);
    return res.status(200).send({ ...result });
  }

  @ApiResponse({
    status: 200,
    description: 'Order was bought',
    type: 'OK',
  })
  @Post('buy')
  async buy(@Res() res: Response, @User() user: IUserInterface, @Body() body: IBuyOrderRequest) {
    const result = await this.orderService.buy(body, user.data);
    return res.status(200).send({
      ...result,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Order was created',
    type: ICreateOrderResponseDto,
  })
  @Post()
  async create(@Res() res: Response, @User() user: IUserInterface, @Body() body: ICreateOrderDto) {
    const result = await this.orderService.create({ ...body, identityId: user.data.id }, user.data);

    return res.status(200).send({
      ...result,
    });
  }

  @ApiResponse({
    status: 201,
    description: 'Order was updated',
    type: IUpdateOrderResponseDto,
  })
  @Patch()
  async update(@Res() res: Response, @User() user: IUserInterface, @Body() body: IUpdateOrderDto) {
    const result = await this.orderService.update(body, user.data);

    return res.status(201).send({
      ...result,
    });
  }

  @ApiResponse({
    status: 204,
    description: 'Order was removed',
    type: IUpdateOrderResponseDto,
  })
  @Delete(':id')
  async delete(
    @Res() res: Response,
    @User() user: IUserInterface,
    @Param() param: IDeleteOrderParam,
    @Query() query: IDeleteOrderQuery,
  ) {
    const result = await this.orderService.delete(param.id, { txHash: query.txHash, user: user.data });
    return res.status(204).send({
      ...result,
    });
  }
}
