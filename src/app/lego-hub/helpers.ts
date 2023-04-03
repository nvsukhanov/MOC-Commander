export function readBitAtPosition(value: number, position: number): boolean {
    return (value & (1 << position)) !== 0;
}

export function concatUint8ToUint16(high: number, low: number): number {
    return (high << 8) + low;
}
