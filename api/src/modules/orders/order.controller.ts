import { Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { IUserInterface } from '@/common/interfaces';
import { User } from '@/common/decorators';
import { ICreateOrderDto, ICreateOrderResponseDto } from './dtos/order-create.dto';
import { OrderService } from './order.service';
import { IUpdateOrderDto, IUpdateOrderResponseDto } from './dtos/update-order.dto';
import { TransactionHistoryService } from '../transaction-history/transaction-history.service';

@ApiTags('Orders')
@Controller()
export class OrderController {
  constructor(private orderService: OrderService, private historyService: TransactionHistoryService) {}

  @ApiResponse({
    status: 200,
    description: 'Order was created',
    type: ICreateOrderResponseDto,
  })
  @Get(':id')
  async findOne(@Res() res: Response, @Param() param: { id: string }) {
    const result = await this.orderService.findOne(param.id);
    return res.status(200).send({ ...result });
  }

  @ApiResponse({
    status: 200,
    description: 'Order was created',
    type: ICreateOrderResponseDto,
  })
  @Post()
  async create(@Res() res: Response, @User() user: IUserInterface, @Body() body: ICreateOrderDto) {
    const result = await this.orderService.create({ ...body, identityId: user.data.id });

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
    const result = await this.orderService.update({ ...body, identityId: user.data.id });

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
  async delete(@Res() res: Response, @Param() param: { id: string }) {
    const result = await this.orderService.delete(param.id);
    return res.status(204).send({
      ...result,
    });
  }
}
