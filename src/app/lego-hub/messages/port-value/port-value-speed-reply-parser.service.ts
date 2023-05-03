import { Injectable } from '@angular/core';
import { IReplyParser } from '../i-reply-parser';
import { MessageType, PortModeName } from '../../constants';
import { RawMessage } from '../raw-message';
import { PortValueSpeedInboundMessage } from '../inbound-message';
import { convertUint8ToSignedInt } from '../../helpers';

@Injectable()
export class PortValueSpeedReplyParserService implements IReplyParser<MessageType.portValueSingle> {
    public readonly messageType = MessageType.portValueSingle;

    public parseMessage(
        message: RawMessage<MessageType.portValueSingle>
    ): PortValueSpeedInboundMessage {
        return {
            messageType: this.messageType,
            portId: message.payload[0],
            modeName: PortModeName.speed,
            speed: convertUint8ToSignedInt(message.payload[1]),
        };
    }
}
