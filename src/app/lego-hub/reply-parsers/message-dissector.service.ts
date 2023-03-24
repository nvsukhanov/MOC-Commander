import { Injectable } from '@angular/core';
import { HubMessageTypes } from '../constants';

export type ParsedMessageResult = {
    messageType: HubMessageTypes,
    payload: Uint8Array
}

@Injectable({ providedIn: 'root' })
export class MessageDissectorService {
    private readonly messageTypeLength = 1;

    private readonly shortHeaderLenght = 1;

    private readonly longHeaderLength = 2;

    private readonly hubIdLength = 1; // https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#common-message-header

    private readonly availableRawMessageTypes = new Set(Object.values(HubMessageTypes));

    public parse(message: Uint8Array): ParsedMessageResult | null {
        const messageType = message[this.getMessageTypeOffset(message)];
        if (!this.availableRawMessageTypes.has(messageType)) {
            console.warn('unknown message type', messageType, 'at', this.getMessageTypeOffset(message), 'in', message.join(' ')); // TODO: proper logging
            return null;
        }
        return {
            messageType,
            payload: this.getPayload(message)
        };
    }

    private getPayload(message: Uint8Array): Uint8Array {
        return message.slice(
            this.getMessagePayloadOffset(message)
        );
    }

    private getMessageTypeOffset(message: Uint8Array): number {
        const headerLength = message[0] >= 127 ? this.longHeaderLength : this.shortHeaderLenght;
        return headerLength + this.hubIdLength;
    }

    private getMessagePayloadOffset(message: Uint8Array): number {
        return this.getMessageTypeOffset(message) + this.messageTypeLength;
    }
}
