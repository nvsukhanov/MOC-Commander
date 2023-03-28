import { Injectable } from '@angular/core';
import { HubMessageType } from '../constants';
import { HubMessage, HubPropertyDownstreamMessageBody, HubPropertyDownstreamMessageFactoryService } from './index';

export type DissectedMessageResult = {
    messageType: HubMessageType,
    payload: Uint8Array
}

@Injectable()
export class HubDownstreamMessageDissectorService {
    private readonly messageTypeLength = 1;

    private readonly shortHeaderLength = 1;

    private readonly longHeaderLength = 2;

    private readonly hubIdLength = 1; // https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#common-message-header

    private readonly availableRawMessageTypes = new Set(Object.values(HubMessageType));

    constructor(
        private hh: HubPropertyDownstreamMessageFactoryService
    ) {
    }

    public dissect(rawMessage: Uint8Array): HubMessage<HubPropertyDownstreamMessageBody> {
        const messageType = rawMessage[this.getMessageTypeOffset(rawMessage)];
        this.guardKnownMessageType(messageType);
        return this.hh.createMessage(this.getPayload(rawMessage));
    }

    private getPayload(message: Uint8Array): Uint8Array {
        return message.slice(
            this.getMessagePayloadOffset(message)
        );
    }

    private getMessageTypeOffset(message: Uint8Array): number {
        const headerLength = message[0] >= 127 ? this.longHeaderLength : this.shortHeaderLength;
        return headerLength + this.hubIdLength;
    }

    private getMessagePayloadOffset(message: Uint8Array): number {
        return this.getMessageTypeOffset(message) + this.messageTypeLength;
    }

    private guardKnownMessageType(messageType: HubMessageType): void {
        if (!this.availableRawMessageTypes.has(messageType)) {
            throw new Error(`unknown message type ${messageType}`);
        }
    }
}
