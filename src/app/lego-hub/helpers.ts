export function readBitAtPosition(value: number, position: number): boolean {
    return (value & (1 << position)) !== 0;
}

export function concatUint8ToUint16(high: number, low: number): number {
    return (high << 8) + low;
}

export function numberToUint32LEArray(value: number): number[] {
    return [
        value & 0xff,
        (value >> 8) & 0xff,
        (value >> 16) & 0xff,
        (value >> 24) & 0xff
    ];
}

export function readNumberFromUint8LEArray(value: Uint8Array): number {
    return value.reduce((acc, val, index) => acc + (val << (index * 8)), 0);
}

export function convertUint8ToSignedInt(value: number): number {
    return value > 127 ? value - 256 : value;
}

export function convertUint32ToSignedInt(value: number): number {
    return value > 2147483647 ? value - 4294967296 : value;
}

export function concatUint8Arrays(...a: Uint8Array[]): Uint8Array {
    const totalLength = a.reduce((acc, val) => acc + val.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of a) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}
