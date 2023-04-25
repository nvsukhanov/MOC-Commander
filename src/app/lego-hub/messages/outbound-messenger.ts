import { MessageType } from '../constants';
import { RawMessage } from './raw-message';
import { IMessageMiddleware } from '../i-message-middleware';

export class OutboundMessenger {
    private queue: Promise<unknown> = Promise.resolve(); // TODO: replace with more sophisticated queue (with queue size tracking)

    private readonly messageTypeLength = 1;

    constructor(
        private readonly characteristic: BluetoothRemoteGATTCharacteristic,
        private readonly messageMiddleware: IMessageMiddleware[],
    ) {
    }

    public send(
        message: RawMessage<MessageType>
    ): Promise<void> {
        const processedMessage = this.messageMiddleware.reduce((acc, middleware) => middleware.handle(acc), message);

        const header = this.composeHeader(processedMessage);
        const packet = this.concatTypedArrays(header, processedMessage.payload);
        const promise = this.queue.then(() => {
            return this.characteristic.writeValueWithResponse(packet);
        });
        this.queue = promise;
        return promise;
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
