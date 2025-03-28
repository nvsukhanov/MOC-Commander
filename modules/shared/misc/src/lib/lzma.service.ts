import { Injectable } from '@angular/core';
import Lzma from 'lzma/src/lzma_worker';

@Injectable({ providedIn: 'root' })
export class LzmaService {
  public compress(data: string): number[] {
    return Lzma.LZMA_WORKER.compress(data, 9);
  }

  public decompress(data: number[]): string {
    return Lzma.LZMA_WORKER.decompress(data);
  }
}
