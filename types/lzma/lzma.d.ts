declare namespace Lzma {
    declare namespace LZMA_WORKER {
        export function compress(
            data: string,
            mode: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
        ): number[];

        export function decompress(
            data: number[]
        ): string;
    }
}

declare module 'lzma/src/lzma_worker' {
    export = Lzma;
}

