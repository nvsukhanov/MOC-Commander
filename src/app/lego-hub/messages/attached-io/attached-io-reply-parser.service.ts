import { Injectable } from '@angular/core';
import { AttachIoEvent, MessageType } from '../../constants';
import { IReplyParser } from '../i-reply-parser';
import { RawMessage } from '../raw-message';
import {
    AttachedIoAttachInboundMessage,
    AttachedIOAttachVirtualInboundMessage,
    AttachedIODetachInboundMessage,
    AttachedIOInboundMessage
} from '../inbound-message';
import { readUint16LEArrayAsNumber } from '../../helpers';

@Injectable()
export class AttachedIoReplyParserService implements IReplyParser<MessageType.attachedIO> {
    public readonly messageType = MessageType.attachedIO;

    private readonly portIdOffset = 0;

    private readonly eventIdOffset = 1;

    private readonly ioTypeIdOffsetByte0 = 2;

    private readonly ioTypeIdOffsetByte1 = 3;

    private readonly portIdAOffset = 12;

    private readonly portIdBOffset = 13;

    public parseMessage(
        rawMessage: RawMessage<MessageType.attachedIO>
    ): AttachedIOInboundMessage {
        const payload = rawMessage.payload;
        switch (this.getEventId(payload)) {
            case AttachIoEvent.Attached:
                return this.composeAttachReply(payload);
            case AttachIoEvent.Detached:
                return this.composeDetachReply(payload);
            case AttachIoEvent.AttachedVirtual:
                return this.composeAttachVirtualIO(payload);
        }
    }

    private composeAttachReply(payload: Uint8Array): AttachedIoAttachInboundMessage {
        return {
            messageType: MessageType.attachedIO,
            portId: this.getPortId(payload),
            event: AttachIoEvent.Attached,
            ioTypeId: this.getIoTypeId(payload),
            hardwareRevision: this.decodeVersion(payload.slice(4, 7)),
            softwareRevision: this.decodeVersion(payload.slice(8, 11)),
        };
    }

    private composeDetachReply(payload: Uint8Array): AttachedIODetachInboundMessage {
        return {
            messageType: MessageType.attachedIO,
            portId: this.getPortId(payload),
            event: AttachIoEvent.Detached
        };
    }

    private composeAttachVirtualIO(payload: Uint8Array): AttachedIOAttachVirtualInboundMessage {
        return {
            messageType: MessageType.attachedIO,
            portId: this.getPortId(payload),
            event: AttachIoEvent.AttachedVirtual,
            ioTypeId: this.getIoTypeId(payload),
            portIdA: payload[this.portIdAOffset],
            portIdB: payload[this.portIdBOffset]
        };
    }

    private getIoTypeId(data: Uint8Array): number {
        return data[this.ioTypeIdOffsetByte0] + (data[this.ioTypeIdOffsetByte1] << 8);
    }

    private getPortId(data: Uint8Array): number {
        return data[this.portIdOffset];
    }

    private getEventId(data: Uint8Array): AttachIoEvent {
        return data[this.eventIdOffset];
    }

    private decodeVersion(data: Uint8Array): string {
        const majorVersion = data[0] >> 4;
        const minorVersion = data[0] & 0b00001111;
        const bugFixingNumber = data[1];
        const buildNumber = readUint16LEArrayAsNumber(data.slice(2, 4));
        return `${majorVersion}.${minorVersion}.${bugFixingNumber}.${buildNumber}`;
    }

}
