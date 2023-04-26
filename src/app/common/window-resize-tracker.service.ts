import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../types';
import { fromEvent, share } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WindowResizeTrackerService {
    public readonly resize$ = fromEvent(this.window, 'resize').pipe(
        share()
    );

    constructor(
        @Inject(WINDOW) private readonly window: Window
    ) {
    }
}
