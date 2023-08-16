import { InjectionToken } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export type ExtractTokenType<T> = T extends InjectionToken<infer K> ? K : never;
export type ExtractArrayType<T> = T extends Array<infer K> ? K : never;

export type DeepReadonly<T extends object> = {
    readonly [k in keyof T]: T[k] extends object ? DeepReadonly<T[k]> : T[k];
};

export type ToFormGroup<T extends object> = FormGroup<{
    [K in keyof T]: T[K] extends object ? ToFormGroup<T[K]> : FormControl<T[K]>;
}>;
