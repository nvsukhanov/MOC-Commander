import { MessageType } from '../constants';
import { InboundMessage } from './inbound-message';

import { RawMessage } from './raw-message';

export interface IReplyParser<T extends MessageType> {
    readonly messageType: T;

    parseMessage(message: RawMessage<T>): InboundMessage & { messageType: T };
}
