import { Inject, Injectable } from '@angular/core';

import { WINDOW } from './types';

@Injectable({ providedIn: 'root' })
export class IdGeneratorService {
    constructor(
        @Inject(WINDOW) private window: Window,
    ) {
    }

    public generateId(): string {
        return this.window.crypto.randomUUID();
    }
}
