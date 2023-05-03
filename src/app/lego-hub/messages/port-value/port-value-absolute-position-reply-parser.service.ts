import { Injectable } from '@angular/core';
import { IReplyParser } from '../i-reply-parser';
import { MessageType, PortModeName } from '../../constants';
import { RawMessage } from '../raw-message';
import { PortValueAbsolutePositionInboundMessage } from '../inbound-message';
import { convertUint32ToSignedInt, readNumberFromUint8LEArray } from '../../helpers';

@Injectable()
export class PortValueAbsolutePositionReplyParserService implements IReplyParser<MessageType.portValueSingle> {
    public readonly messageType = MessageType.portValueSingle;

    public parseMessage(
        message: RawMessage<MessageType.portValueSingle>
    ): PortValueAbsolutePositionInboundMessage {
        const rawValue = readNumberFromUint8LEArray(message.payload.slice(1, 5));
        const absolutePosition = convertUint32ToSignedInt(rawValue);
        return {
            messageType: this.messageType,
            portId: message.payload[0],
            modeName: PortModeName.absolutePosition,
            absolutePosition
        };
    }
}
