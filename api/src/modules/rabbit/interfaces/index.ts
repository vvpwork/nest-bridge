import { Connection, Channel, ConsumeMessage } from 'amqplib';

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

export interface IRabbitService {
  requestSequence: Map<string | null, { complete: (msg: string) => void }>;
  run(): void;
  getMessageProcessingResult(message: any, priority?: number): Promise<string | null>;
  handlerMessageFromRPC(msg: string): Promise<any>;
  publishMessage(message: any, exchange: string, priority: number): void;
}

export interface IConsumer<T> {
  consume(message: T): Promise<void>;
}
