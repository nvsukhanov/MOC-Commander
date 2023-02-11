import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export interface ITicker {
    readonly tick$: Observable<number>;
}

export const TICKER = new InjectionToken<ITicker>('TICKER');
