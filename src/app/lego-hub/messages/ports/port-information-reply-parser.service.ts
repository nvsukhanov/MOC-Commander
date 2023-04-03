import { Injectable } from '@angular/core';
import { IReplyParser } from '../i-reply-parser';
import { MessageType } from '../../constants';
import { InboundMessage } from '../inbound-message';
import { RawMessage } from '../raw-message';

@Injectable()
export class PortInformationReplyParserService implements IReplyParser<MessageType.portInformation> {
    public readonly messageType = MessageType.portInformation;

    public parseMessage(
        message: RawMessage<MessageType.portInformation>
    ): InboundMessage & { messageType: MessageType.portInformation } {
        return {
            messageType: this.messageType,
            portId: message.payload[0],
            payload: message.payload.slice(2)
        };
    }

}
