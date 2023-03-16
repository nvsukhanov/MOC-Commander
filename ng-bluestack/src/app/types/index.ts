import { InjectionToken } from '@angular/core';

export * from './i-ticker';
export * from './i-vector';
export * from './controller-type';
export * from './controller-control-state';

export type ExtractTokenType<T> = T extends InjectionToken<infer K> ? K : never;

export const WINDOW = new InjectionToken('window', {
    factory: (): Window => window
});

export const NAVIGATOR = new InjectionToken('navigator', {
    factory: (): Navigator => window.navigator
});
