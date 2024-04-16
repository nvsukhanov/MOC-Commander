import murmur3 from 'murmurhash-js';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HashService {
    public murmur3(
        value: string,
    ): number {
        return murmur3(value);
    }
}
