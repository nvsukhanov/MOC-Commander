import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken('window', {
    factory: (): Window => window
});

export const NAVIGATOR = new InjectionToken('navigator', {
    factory: (): Navigator => window.navigator
});

export const BUTTON_RELEASED = 0;
export const BUTTON_PRESSED = 1;
