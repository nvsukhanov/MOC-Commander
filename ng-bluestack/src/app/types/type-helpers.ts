import { InjectionToken } from '@angular/core';

export type ExtractTokenType<T> = T extends InjectionToken<infer K> ? K : never;
