import { IHubMessageBody } from './i-hub-message-body';

export class HubMessage<TPayload extends IHubMessageBody> {
    private readonly messageTypeLength = 1;

    constructor(
        public readonly body: TPayload
    ) {
    }

    public get hubMessageType(): TPayload['messageType'] {
        return this.body.messageType;
    }

    public getBuffer(): Uint8Array {
        const payload = this.body.payload;
        const header = this.composeHeader(payload);
        return this.concatTypedArrays(header, payload);
    }

    public toString(): string {
        return this.getBuffer().join(' ');
    }

    private composeHeader(payload: ArrayBuffer): Uint8Array {
        if (this.getPayloadLengthPaddedWithMessageType() < 127) {
            return Uint8Array.from([ payload.byteLength, 0x00, this.body.messageType ]);
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

    private getPayloadLengthPaddedWithMessageType(): number {
        return this.body.payload.length + this.messageTypeLength;
    }
}
