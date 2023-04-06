import { LoggingService } from '../../logging';
import { MessageType } from '../constants';
import { RawMessage } from './raw-message';
import { Inject } from '@angular/core';
import { ILegoHubConfig, LEGO_HUB_CONFIG } from '../i-lego-hub-config';

export class OutboundMessenger {
    private queue: Promise<unknown> = Promise.resolve(); // TODO: replace with more sophisticated queue (with queue size tracking)

    private readonly messageTypeLength = 1;

    private readonly dumpMessageTypesSet: ReadonlySet<MessageType>;

    constructor(
        private readonly characteristic: BluetoothRemoteGATTCharacteristic,
        private readonly logging: LoggingService,
        @Inject(LEGO_HUB_CONFIG) private readonly config: ILegoHubConfig,
    ) {
        this.dumpMessageTypesSet = new Set(this.config.dumpOutgoingMessageType === 'all'
                                           ? []
                                           : this.config.dumpOutgoingMessageType
        );
    }

    public send(
        message: RawMessage<MessageType>
    ): Promise<void> {
        const header = this.composeHeader(message);
        const packet = this.concatTypedArrays(header, message.payload);
        const promise = this.queue.then(() => {
            if (this.config.dumpOutgoingMessageType === 'all' || this.dumpMessageTypesSet.has(message.header.messageType)) {
                const preparedMessage = this.formatMessageForDump(message);
                this.logging.debug(`Sending message of type ${preparedMessage.messageType} with payload ${preparedMessage.payload}`);
            }
            return this.characteristic.writeValueWithResponse(packet).catch((error) => {
                const preparedMessage = this.formatMessageForDump(message);
                this.logging.error(`Failed to send message of type ${preparedMessage.messageType} with payload ${preparedMessage.payload}`);
                this.logging.error(error);
                throw error;
            });
        });
        this.queue = promise;
        return promise;
    }

    private formatMessageForDump(message: RawMessage<MessageType>): { messageType: string, payload: string } {
        const messageType = `${this.numberToHex(message.header.messageType)} (${MessageType[message.header.messageType]})`;
        const payload = [ ...message.payload ].map((v) => this.numberToHex(v)).join(' ');
        return { messageType, payload };
    }

    private numberToHex(number: number): string {
        return `0x${number.toString(16).padStart(2, '0')}`;
    }

    private composeHeader(
        message: RawMessage<MessageType>
    ): Uint8Array {
        if (this.getPayloadLengthPaddedWithMessageType(message) < 127) {
            return Uint8Array.from([ message.payload.byteLength, 0x00, message.header.messageType ]);
        } else {
            throw new Error('Long messages are not supported yet'); // TODO: add support
        }
    }

    private concatTypedArrays(...a: Uint8Array[]): Uint8Array {
        const totalLength = a.reduce((acc, val) => acc + val.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const arr of a) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }

    private getPayloadLengthPaddedWithMessageType(
        message: RawMessage<MessageType>
    ): number {
        return message.payload.length + this.messageTypeLength;
    }
}
