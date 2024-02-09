import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { NAVIGATOR } from './types';

type WakeLockDescriptor = {
    sentinel: WakeLockSentinel;
    abortController: AbortController;
};

@Injectable({
    providedIn: 'root'
})
export class WakeLockService {
    private wakeLockDescriptor?: WakeLockDescriptor;

    constructor(
        @Inject(NAVIGATOR) private readonly navigator: Navigator,
        @Inject(DOCUMENT) private readonly document: Document
    ) {
    }

    public async requestWakeLock(): Promise<void> {
        if (this.navigator.wakeLock && !this.wakeLockDescriptor) {
            let sentinel: WakeLockSentinel;
            try {
                sentinel = await this.navigator.wakeLock.request('screen');
            } catch (e) {
                console.warn('Failed to request wake lock:', e);
                return;
            }
            const abortController = new AbortController();
            this.wakeLockDescriptor = { sentinel, abortController };

            this.document.addEventListener('visibilitychange', () => {
                if (this.document.visibilityState === 'visible') {
                    this.wakeLockDescriptor?.abortController.abort();
                    this.wakeLockDescriptor = undefined;
                    this.requestWakeLock();
                }
            }, {
                signal: abortController.signal
            });
        }
    }

    public async releaseWakeLock(): Promise<void> {
        if (this.wakeLockDescriptor) {
            this.wakeLockDescriptor.abortController.abort();
            await this.wakeLockDescriptor.sentinel.release();
            this.wakeLockDescriptor = undefined;
        }
    }
}
