import { Connection, Channel, ConsumeMessage } from 'amqplib';
import { TypeRpcCommand, TypeRpcMessage } from './enums';

export interface IRabbitConnect {
  exchange: string;
  queue: string;
  push_queue: string;
  get channel(): Channel;
  get connection(): Connection;
  connect(): Promise<any>;
  disconnect(): Promise<any>;
}

export enum ConnectRabbitType {
  RPC = 'rps',
  CONSUME = 'consume',
}

export interface IRabbitRPCRequest {
  message: any | null;
  get id(): string | undefined;
  complete(message: string): string;
  destroy(): void;
  publish(connection: IRabbitConnect): Promise<void>;
  on(name: string, callback: () => void): void;
  emit(name: string, message: string): void;
  removeAllListeners(): void;
}

/**
 * This class provide public wrapper under RabbitMQ basic manipulations

 * @class
 * @param {string}  rpc_exchange - name for the  exchange  to create rpc to another service
 * @param {string}  name_exchange - name  for the exchange to get messages from  rpc call
 */
export interface IRabbitService {
  run(): void;

  /**
   * This function processes message from rabbitmq and return result that sand to the replyTo queue
   * You should add your logic before call init
   * @param msg - message from rabbitmq
   * @returns - promise
   */
  handlerMessageFromRPC(msg: string): Promise<any>;
  /**
   *  Use this method to publish message to custom exchange
   * @param message
   * @param exchange
   * @param priority
   */
  publishMessage(message: any, exchange: string, priority: number): void;
}

export interface IConsumer<T> {
  consume(message: T): Promise<void>;
}

export interface IMessageRabbit {
  type: TypeRpcMessage;
  command: TypeRpcCommand;
  // TODO add generic type
  data: { [key: string]: any };
}

export interface IRabbitRootService {
  init(): Promise<void>;
  publish(message: any): void;
}
