import { Injectable } from '@angular/core';
import { HubMessageType } from '../constants';
import { LoggingService } from '../../logging';

export type ParsedMessageResult = {
    messageType: HubMessageType,
    payload: Uint8Array
}

@Injectable()
export class MessageDissectorService {
    private readonly messageTypeLength = 1;

    private readonly shortHeaderLength = 1;

    private readonly longHeaderLength = 2;

    private readonly hubIdLength = 1; // https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#common-message-header

    private readonly availableRawMessageTypes = new Set(Object.values(HubMessageType));

    constructor(
        private readonly logging: LoggingService
    ) {
    }

    public parse(message: Uint8Array): ParsedMessageResult | null {
        const messageType = message[this.getMessageTypeOffset(message)];
        if (!this.availableRawMessageTypes.has(messageType)) {
            this.logging.warning('unknown message type', messageType, 'at', this.getMessageTypeOffset(message), 'in', message.join(' '));
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
        const headerLength = message[0] >= 127 ? this.longHeaderLength : this.shortHeaderLength;
        return headerLength + this.hubIdLength;
    }

    private getMessagePayloadOffset(message: Uint8Array): number {
        return this.getMessageTypeOffset(message) + this.messageTypeLength;
    }
}
