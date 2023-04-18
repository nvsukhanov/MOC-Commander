import { InjectionToken } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';

export type ExtractTokenType<T> = T extends InjectionToken<infer K> ? K : never;
export type ExtractArrayType<T> = T extends Array<infer K> ? K : never;

export type DeepReadonly<T extends object> = {
    readonly [k in keyof T]: T[k] extends object ? DeepReadonly<T[k]> : T[k];
}

export type ExtractSelectorReturnType<T> = T extends MemoizedSelector<any, infer K> ? K : never;
export type ExtractSelectorFactoryReturnType<T> = T extends (...args: any) => MemoizedSelector<any, any>
                                                  ? ExtractSelectorReturnType<ReturnType<T>>
                                                  : never;
