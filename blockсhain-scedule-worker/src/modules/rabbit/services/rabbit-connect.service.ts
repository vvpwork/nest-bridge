/* eslint-disable default-param-last */
import { Logger } from '@nestjs/common';
import { Connection, Channel, connect } from 'amqplib';
import { config } from '@/common/config';

import { IRabbitConnect, ConnectRabbitType } from '../interfaces';

const { uri: rabbitUri } = config.rabbit;

export class RabbitConnect implements IRabbitConnect {
  protected _uri: string;
  private _connection: Connection;
  private _channel: Channel;
  public exchange: string;
  public queue: string;
  public push_queue: string;
  private _count_to_connect: number = 3;

  constructor(name_exchange: string = 'rpc_exchange', uri?: string) {
    this._uri = uri || rabbitUri;
    this.exchange = name_exchange;
    this.queue = `${this.exchange}_queue`;
  }

  public async connect(type: ConnectRabbitType = ConnectRabbitType.RPC) {
    try {
      this._connection = await connect(this._uri);
      this._connection.on('error', this.errorHandler);
      this._connection.on('close', this.errorHandler);

      this._channel = await this._connection.createChannel();
      this._channel.assertExchange(this.exchange, 'fanout', {
        durable: false,
      });

      if (type === ConnectRabbitType.RPC) {
        const q = await this._channel.assertQueue('', {
          exclusive: true,
          maxPriority: 10,
        });
        this.push_queue = q.queue;
      }

      await this.channel.assertQueue(this.queue, {
        durable: false,
        maxPriority: 10,
      });
      await this.channel.bindQueue(this.queue, this.exchange, '');
      await this.channel.prefetch(1);

      this._count_to_connect = 0;
    } catch (error: any) {
      Logger.error('Error rabbit connect');
      process.exit(1);
    }
  }

  private async errorHandler(error: any) {
    Logger.error(error, `Rabbit connect error`);
    this.connect();
  }

  private async closeHandler(error: any) {
    Logger.error(error, `Rabbit connect close`);
    process.exit(1);
  }

  public async disconnect() {
    await this._channel.close();
    return this._connection.close();
  }

  get channel() {
    return this._channel;
  }

  get connection() {
    return this._connection;
  }

  public ack(message: any) {
    return this.channel.ack(message);
  }
}
