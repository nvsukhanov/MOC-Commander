import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageHeaderAppenderService {
    public wrapPayload(
        payload: Uint8Array
    ): Uint8Array {
        const header = this.composeHeader(payload);
        return this.concatTypedArrays(header, payload);
    }

    private composeHeader(payload: ArrayBuffer): Uint8Array {
        if (payload.byteLength < 127) {
            return Uint8Array.from([ payload.byteLength, 0x00 ]);
        } else {
            throw new Error('Long messages are not supported yet'); // TODO: add support
        }
    }

    private concatTypedArrays(a: Uint8Array, b: Uint8Array): Uint8Array {
        const result = new Uint8Array(a.length + b.length);
        result.set(a);
        result.set(b, a.length);
        return result;
    }
}
