/* eslint-disable default-param-last */
import { Logger } from '@nestjs/common';
import { Connection, Channel, connect } from 'amqplib';
import { config } from '@/common/config';

import { IRabbitConnect, ConnectRabbitType } from '../interfaces';

const { uri: rabbitUri } = config.rabbit;

/**
 * This class is connecting to rabbitMQ server
 */
export class RabbitConnect implements IRabbitConnect {
  protected _uri: string;
  private _connection: Connection;
  private _channel: Channel;
  public exchange: string;
  public queue: string;
  public push_queue: string;

  constructor(name_exchange: string = 'rpc_exchange', uri?: string) {
    this._uri = uri || rabbitUri;
    this.exchange = name_exchange;
    this.queue = `${this.exchange}_queue`;
  }

  /**
   * This function connects to rabbitMQ server and does basic setting
   */
  public connect: any = async (type: ConnectRabbitType = ConnectRabbitType.RPC) => {
    try {
      this._connection = await connect(this._uri);
      Logger.log(this._connection, `[Rabbit connect service] connect to ${this._uri}`);
      this._connection.on('error', this.errorHandler.bind(this));
      this._connection.on('close', this.errorHandler.bind(this));

      this._channel = await this._connection.createChannel();
      this._channel.assertExchange(this.exchange, 'fanout', {
        durable: false,
      });

      if (type === ConnectRabbitType.RPC) {
        const q = await this._channel.assertQueue('', { exclusive: true, maxPriority: 10 });
        this.push_queue = q.queue;
      }

      await this.channel.assertQueue(this.queue, { durable: false, maxPriority: 10 });
      await this.channel.bindQueue(this.queue, this.exchange, '');
      await this.channel.prefetch(1);
    } catch (error: any) {
      Logger.error('Error rabbit connect');
      process.exit(1);
    }
  };

  /**
   * This function is logging error to console
   * @param error - error from rabbitMQ connection
   */
  private async errorHandler(error: any) {
    Logger.error('Error rabbit reconnect');
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
