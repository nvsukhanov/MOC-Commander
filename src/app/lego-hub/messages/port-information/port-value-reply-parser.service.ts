import { Injectable } from '@angular/core';
import { IReplyParser } from '../i-reply-parser';
import { MessageType } from '../../constants';
import { RawMessage } from '../raw-message';
import { InboundMessage } from '../inbound-message';

@Injectable()
export class PortValueReplyParserService implements IReplyParser<MessageType.portValueSingle> {
    public readonly messageType = MessageType.portValueSingle;

    public parseMessage(
        message: RawMessage<MessageType.portValueSingle>
    ): InboundMessage & { messageType: MessageType.portValueSingle } {
        return {
            messageType: this.messageType,
            portId: message.payload[0],
            payload: message.payload.slice(1)
        };
    }
}
