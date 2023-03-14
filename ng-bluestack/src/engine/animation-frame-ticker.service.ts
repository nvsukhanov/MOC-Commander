import { ITicker } from '../app/types';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AnimationFrameTickerService implements ITicker {
    private isRunning = false
    private ticker$: Subject<number> = new Subject<number>();

    public get tick$(): Observable<number> {
        if (!this.isRunning) {
            this.isRunning = true;
            this.ticker$ = new Subject<number>();
            this.startTicker();
        }
        return this.ticker$;
    }

    public stop(): void {
        this.isRunning = false;
    }

    private async startTicker(): Promise<void> {
        while (this.isRunning) {
            const e = await this.getRequestAnimationFramePromise();
            this.ticker$.next(e);
        }
    }

    private getRequestAnimationFramePromise(): Promise<number> {
        return new Promise((resolve) => {
            window.requestAnimationFrame((e) => resolve(e));
        });
    }
}
