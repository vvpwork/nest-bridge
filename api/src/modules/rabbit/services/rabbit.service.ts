/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/typedef */
import { HttpException, Logger } from '@nestjs/common';
import { Message } from 'amqplib';
import { IRabbitRPCRequest, IRabbitService, ConnectRabbitType } from '../interfaces';
import { config } from '@/common/config';

import { RabbitConnect } from './rabbit-connect.service';
import { RabbitRPCRequest } from './rabbit-request.service';

const { timeoutDelay, exchangeNameDefault, exchangeNameRpc } = config.rabbit;

/**
 * This class provide public wrapper under RabbitMQ basic manipulations

 * @class
 * @param {string}  rpc_exchange - name for the  exchange  to create rpc to another service
 * @param {string}  name_exchange - name  for the exchange to get messages from  rpc call
 */
export class RabbitService implements IRabbitService {
  private rpc_connection: RabbitConnect;
  private consume_connection: RabbitConnect;
  public requestSequence: Map<string | null, { complete: (msg: string) => void }>;
  public static instance: RabbitService;

  private constructor(rpc_exchange: string, consume_exchange: string) {
    this.rpc_connection = new RabbitConnect(rpc_exchange);
    this.consume_connection = new RabbitConnect(consume_exchange);
    // setup internal object to store all sended requests
    this.requestSequence = new Map<string, { complete: (msg: string) => void }>();
  }

  public static async getInstance(
    rpc_exchange: string = exchangeNameRpc,
    consume_exchange: string = exchangeNameDefault,
  ): Promise<RabbitService> {
    if (!RabbitService.instance) {
      RabbitService.instance = new RabbitService(rpc_exchange, consume_exchange);

      // connect to the exchange for publishing  rpc message and waiting answer from another service
      await RabbitService.instance.rpc_connection.connect(ConnectRabbitType.RPC);

      // connect the exchange to listening another service
      await RabbitService.instance.consume_connection.connect(ConnectRabbitType.CONSUME);
    }
    return RabbitService.instance;
  }

  // run all consumers
  public run = () => {
    this.initConsume();
    this.initRpc();
  };

  /**
   *  This is callback function
   *  Validate correlationId
   *  If correlationId is valid calls comlete function for this message
   * @param message - default message rabbitMQ
   * @returns - void
   */
  private messageHandler = (message: Message | null) => {
    console.log(message);
    const currentHandler = this.requestSequence.get(message!.properties.correlationId);
    if (currentHandler) {
      currentHandler.complete(message!.content.toString());
      this.requestSequence.delete(message!.properties.correlationId);
      this.rpc_connection.ack(message);
    }
  };

  /**
   * This method consume to exclusive queue and handles all messages
   */
  private initRpc = () => {
    try {
      Logger.log(`[x] awaiting message from rpc queue ${this.rpc_connection.push_queue}`);
      this.rpc_connection.channel.consume(this.rpc_connection.push_queue, this.messageHandler);
    } catch (err) {
      Logger.error('Error add consume', err);
    }
  };

  private initConsume() {
    try {
      const { channel, queue } = this.consume_connection;
      Logger.log(`[x] awaiting  message from default queue ${queue}`);
      channel.consume(queue, async msg => {
        try {
          this.consume_connection.ack(msg);
          const message = msg!.content.toString();
          this.handlerMessageFromRPC(message);
        } catch (error: any) {
          Logger.error('Error handel message ', error);
        }
      });
    } catch (error: any) {
      Logger.error('Error init consume', error);
      throw new Error(error);
    }
  }

  /**
   *
   * @param request - instance RabbitRPCRequest
   * @param reject  - reject function from wrapped Promise
   * @returns - void
   */
  private timeoutHandler(request: IRabbitRPCRequest, reject: (reason: any) => void) {
    return setTimeout(() => {
      request.destroy();
      reject(new Error('Error TIMEOUT rabbit'));
    }, timeoutDelay);
  }

  /**
   *
   * This method  send sa new request for the processing and return a Promise that waits for the response returning.
   *
   * @param {TypeWagerRequest} message - message
   * @param {number} priority - priority of message
   * @returns
   */
  public async getMessageProcessingResult(
    message: { [key: string]: any },
    priority: number = 10,
  ): Promise<string | any> {
    try {
      const newRequest = new RabbitRPCRequest(message, priority);

      this.requestSequence.set(newRequest.id!, { complete: newRequest.complete });

      await newRequest.publish(this.rpc_connection);

      return new Promise((resolve, reject) => {
        this.timeoutHandler(newRequest, reject);

        newRequest.on('complete', resolve);
      });
    } catch (e) {
      Logger.error(e);
    }
  }

  /**
   *  Use this method to publish message to custom exchange
   * @param message
   * @param exchange
   * @param priority
   */
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

  /**
   * This function processes message from rabbitmq and return result that sand to the replyTo queue
   * You should add your logic before call init
   * @param msg - message from rabbitmq
   * @returns - promise
   */
  public handlerMessageFromRPC = async (msg: string): Promise<any> => {
    throw new Error('You should add you logic to RabbitRPCconsume.handlerMessageFromRPC');
  };
}
