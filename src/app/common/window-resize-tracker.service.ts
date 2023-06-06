import { Inject, Injectable } from '@angular/core';
import { fromEvent, share } from 'rxjs';

import { WINDOW } from './types';

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
