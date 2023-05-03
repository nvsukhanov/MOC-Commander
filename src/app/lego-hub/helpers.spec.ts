import { concatUint8Arrays, concatUint8ToUint16, numberToUint32LEArray, readBitAtPosition, readNumberFromUint8LEArray } from './helpers';

describe('Helpers', () => {
    describe('readBitAtPosition', () => {
        it('should return true if bit is set', () => {
            expect(readBitAtPosition(0x01, 0)).toBeTruthy();
            expect(readBitAtPosition(0x02, 1)).toBeTruthy();
            expect(readBitAtPosition(0x04, 2)).toBeTruthy();
            expect(readBitAtPosition(0x08, 3)).toBeTruthy();
            expect(readBitAtPosition(0x10, 4)).toBeTruthy();
            expect(readBitAtPosition(0x20, 5)).toBeTruthy();
            expect(readBitAtPosition(0x40, 6)).toBeTruthy();
            expect(readBitAtPosition(0x80, 7)).toBeTruthy();
        });

        it('should return false if bit is not set', () => {
            expect(readBitAtPosition(0x00, 0)).toBeFalsy();
            expect(readBitAtPosition(0x00, 1)).toBeFalsy();
            expect(readBitAtPosition(0x00, 2)).toBeFalsy();
            expect(readBitAtPosition(0x00, 3)).toBeFalsy();
            expect(readBitAtPosition(0x00, 4)).toBeFalsy();
            expect(readBitAtPosition(0x00, 5)).toBeFalsy();
            expect(readBitAtPosition(0x00, 6)).toBeFalsy();
            expect(readBitAtPosition(0x00, 7)).toBeFalsy();
        });
    });

    describe('concatUint8ToUint16', () => {
        it('should concat 2 uint8 into a single uint16', () => {
            expect(concatUint8ToUint16(0x01, 0x02)).toBe(0x0102);
            expect(concatUint8ToUint16(0x10, 0x20)).toBe(0x1020);
            expect(concatUint8ToUint16(0x11, 0x22)).toBe(0x1122);
        });
    });

    describe('numberToUint32LEArray', () => {
        it('should convert a number to an array of 4 uint8', () => {
            expect(numberToUint32LEArray(0x01020304)).toEqual([ 0x04, 0x03, 0x02, 0x01 ]);
            expect(numberToUint32LEArray(0x11223344)).toEqual([ 0x44, 0x33, 0x22, 0x11 ]);
        });
    });

    describe('readNumberFromUint8LEArray', () => {
        it('should convert an LE array of 4 uint8 to a number', () => {
            expect(readNumberFromUint8LEArray(new Uint8Array([ 0x04, 0x03, 0x02, 0x01 ]))).toBe(0x01020304);
            expect(readNumberFromUint8LEArray(new Uint8Array([ 0x44, 0x33, 0x22, 0x11 ]))).toBe(0x11223344);
        });
    });

    describe('concatUint8Arrays', () => {
        it('should concat multiple Uint8Arrays', () => {
            expect(concatUint8Arrays(
                new Uint8Array([ 0x01, 0x02 ]),
                new Uint8Array([ 0x03, 0x04 ]))
            ).toEqual(new Uint8Array([ 0x01, 0x02, 0x03, 0x04 ]));
        });
    });
});
