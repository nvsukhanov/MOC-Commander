import { RawMessage } from './messages';
import { MessageType } from './constants';

export interface IMessageMiddleware {
    handle<T extends RawMessage<MessageType>>(message: T): T;
}
