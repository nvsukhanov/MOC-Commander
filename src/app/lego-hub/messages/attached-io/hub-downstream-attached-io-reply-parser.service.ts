import { Injectable } from '@angular/core';
import { HubMessage } from '../hub-message';
import { HubDownstreamAttachedIoMessageBody } from './hub-downstream-attached-io-message-body';
import { HubAttachedIoReply, HubAttachedVirtualIoReply, HubDetachedIoReply, HubReply } from '../hub-reply';
import { IHubDownstreamReplyParser } from '../i-hub-downstream-reply-parser';
import { HubAttachIoEvent, HubMessageType } from '../../constants';

@Injectable()
export class HubDownstreamAttachedIoReplyParser implements IHubDownstreamReplyParser {
    private readonly portIdOffset = 0;

    private readonly eventIdOffset = 1;

    private readonly ioTypeIdOffsetByte0 = 2;

    private readonly ioTypeIdOffsetByte1 = 3;

    private readonly portIdAOffset = 12;

    private readonly portIdBOffset = 13;

    public parseMessage(message: HubMessage<HubDownstreamAttachedIoMessageBody>): HubReply {
        const payload = message.body.payload;
        switch (this.getEventId(payload)) {
            case HubAttachIoEvent.Attached:
                return this.composeAttachReply(payload);
            case HubAttachIoEvent.Detached:
                return this.composeDetachReply(payload);
            case HubAttachIoEvent.AttachedVirtual:
                return this.composeAttachVirtualIO(payload);
        }
    }

    private composeAttachReply(payload: Uint8Array): HubAttachedIoReply {
        return {
            type: HubMessageType.hubAttachedIO,
            portId: this.getPortId(payload),
            event: HubAttachIoEvent.Attached,
            ioTypeId: this.getIoTypeId(payload)
        };
    }

    private composeDetachReply(payload: Uint8Array): HubDetachedIoReply {
        return {
            type: HubMessageType.hubAttachedIO,
            portId: this.getPortId(payload),
            event: HubAttachIoEvent.Detached
        };
    }

    private composeAttachVirtualIO(payload: Uint8Array): HubAttachedVirtualIoReply {
        return {
            type: HubMessageType.hubAttachedIO,
            portId: this.getPortId(payload),
            event: HubAttachIoEvent.AttachedVirtual,
            ioTypeId: this.getIoTypeId(payload),
            portIdA: payload[this.portIdAOffset],
            portIdB: payload[this.portIdBOffset]
        };
    }

    private getIoTypeId(data: Uint8Array): number {
        return data[this.ioTypeIdOffsetByte0] + (data[this.ioTypeIdOffsetByte1] << 8); // TODO: there is no description of this in the documentation
        // maybe if ioType is > than 0xFF, than we should do something like this:
        // return (data[this.ioTypeIdOffsetByte0] << 8) + data[this.ioTypeIdOffsetByte1];
    }

    private getPortId(data: Uint8Array): number {
        return data[this.portIdOffset];
    }

    private getEventId(data: Uint8Array): HubAttachIoEvent {
        return data[this.eventIdOffset];
    }
}
