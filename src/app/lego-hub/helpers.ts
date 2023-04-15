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

export function readUint16LEArrayAsNumber(value: Uint8Array): number {
    return (value[1] << 8) + value[0];
}
