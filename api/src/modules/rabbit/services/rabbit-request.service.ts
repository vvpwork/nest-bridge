import { Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { IRabbitRPCRequest } from '../interfaces';
import { RabbitConnect } from './rabbit-connect.service';

/**
 * This class describes behavior of the RPC request.
 * Basically it should have methods that describe operations under message
 * e.g. pushMessage or so
 * It should extend EventEmitter to provide ability to listen some events
 *
 * All handlers "on" and "emit" should be describe by IRabbitRPCRequest interface
 * @class
 * @param message - request message from client
 */

export class RabbitRPCRequest extends EventEmitter implements IRabbitRPCRequest {
  private _id: string | undefined;
  public message: { [key: string]: any } | null;
  // eslint-disable-next-line @typescript-eslint/typedef
  private priority: number;
  constructor(message: { [key: string]: any }, priority: number = 5) {
    super();
    this._id = this._generateId();
    this.message = message;
    this.priority = priority;
    // describe basic behavior of the listeners included in the class
    this.on('error', this._errorHandler);
  }

  get id() {
    return this._id;
  }

  /**
   * this method should emit request finish event
   */
  public complete(message: string) {
    Logger.log(`[x] get message ${message} to emit handler`);
    this.emit('complete', message);
    this.destroy();
    return message;
  }

  /**
   * this method should manually clear memory
   */
  public destroy() {
    this.removeAllListeners();
    this._id = undefined;
    this.message = null;
  }

  private _errorHandler(error: any) {
    Logger.error('Error emitter', error);
    this.destroy();
  }

  /**
   * This method should generate a specific id for each request
   */
  private _generateId() {
    return uuidv4();
  }

  public async publish(connection: RabbitConnect) {
    const { channel } = connection;

    channel.publish(connection.exchange, '', Buffer.from(JSON.stringify(this.message)), {
      correlationId: this._id,
      replyTo: connection.push_queue,
      priority: this.priority,
    });
    Logger.log(`[x] Publish to rpc ${connection.push_queue}`, this.message);
  }
}
