import { Injectable } from '@angular/core';
import { IReplyParser } from '../i-reply-parser';
import { MessageType } from '../../constants';
import { RawMessage } from '../raw-message';
import { InboundMessage } from '../inbound-message';

@Injectable()
export class PortValueReplyParserService implements IReplyParser<MessageType.portValue> {
    public readonly messageType = MessageType.portValue;

    public parseMessage(
        message: RawMessage<MessageType.portValue>
    ): InboundMessage & { messageType: MessageType.portValue } {
        return {
            messageType: this.messageType,
            portId: message.payload[0],
            payload: message.payload.slice(1)
        };
    }
}
