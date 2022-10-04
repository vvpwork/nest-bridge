/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/typedef */
import { Logger } from '@nestjs/common';
import { Message } from 'amqplib';
import { IRabbitService, ConnectRabbitType } from '../interfaces';
import { config } from '@/common/config';

import { RabbitConnect } from './rabbit-connect.service';

const { timeoutDelay, exchangeNameRpc } = config.rabbit;

export class RabbitService implements IRabbitService {
  private rpc_connection: RabbitConnect;
  public static instance: RabbitService;

  private constructor(rpc_connection: string) {
    this.rpc_connection = new RabbitConnect(rpc_connection);
  }

  public static async getInstance(
    consume_exchange: string = exchangeNameRpc,
  ): Promise<RabbitService> {
    if (!RabbitService.instance) {
      RabbitService.instance = new RabbitService(consume_exchange);

      await RabbitService.instance.rpc_connection.connect(
        ConnectRabbitType.CONSUME,
      );
    }
    return RabbitService.instance;
  }

  public run = () => {
    this.initConsume();
  };

  private initConsume() {
    try {
      const { channel, queue } = this.rpc_connection;
      Logger.log(`[x] awaiting  message from  queue ${queue}`);
      channel.consume(queue, async (msg: Message) => {
        try {
          this.rpc_connection.ack(msg);
          const message = msg!.content.toString();
          const handlerResult = await this.handlerMessageFromRPC(message);
          channel.sendToQueue(
            msg!.properties.replyTo,
            Buffer.from(JSON.stringify(handlerResult)),
            {
              correlationId: msg!.properties.correlationId,
            },
          );
        } catch (error: any) {
          Logger.error(error, 'RabbitService Error handel message ');
        }
      });
    } catch (error: any) {
      Logger.error(error, 'Rabbit service Error init consume');
      throw new Error(error);
    }
  }

  public publishMessage(message: any, exchange: string, priority: number = 5) {
    try {
      const { channel, exchange: connectExchange } = this.rpc_connection;
      if (exchange !== connectExchange) {
        channel.assertExchange(exchange, 'fanout', {
          durable: false,
        });
      }
      channel.publish(exchange, '', Buffer.from(JSON.stringify(message)), {
        priority,
      });

      Logger.log(`[x] Publish to ${exchange} exchange`, message);
    } catch (error) {
      Logger.error('Error publishMessageToAnotherExchange', error);
    }
  }

  public handlerMessageFromRPC = async (msg: string): Promise<any> => {
    throw new Error(
      'You should add you logic to RabbitRPCconsume.handlerMessageFromRPC',
    );
  };
}
