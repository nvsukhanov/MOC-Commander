import { InjectionToken } from '@angular/core';
export * from './i-ticker';
export * from './i-vector';

export type ExtractTokenType<T> = T extends InjectionToken<infer K> ? K : never;

export const WINDOW = new InjectionToken('window', {
    factory: () => window
});

export const NAVIGATOR = new InjectionToken('navigator', {
    factory: () => window.navigator
});
