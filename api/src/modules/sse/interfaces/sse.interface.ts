import { TypeSseMessage } from '../enums/sse-message.enum';

export interface ISseMessage {
  type: TypeSseMessage;
  data: { [key: string]: any };
}
