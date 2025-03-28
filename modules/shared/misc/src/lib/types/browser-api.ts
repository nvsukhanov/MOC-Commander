import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken('window', {
  factory: (): Window => window,
});

export const NAVIGATOR = new InjectionToken('navigator', {
  factory: (): Navigator => window.navigator,
});
