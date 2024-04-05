import { InjectionToken } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Dictionary } from '@ngrx/entity';

export type ExtractTokenType<T> = T extends InjectionToken<infer K> ? K : never;
export type ExtractArrayType<T> = T extends ReadonlyArray<infer K> ? K : never;
export type ExtractEntitiesType<T> = T extends { entities: Dictionary<infer K> } ? K : never;
export type EnsureArraySatisfiesUnion<TObject, TArray extends ReadonlyArray<string>> = keyof TObject extends ExtractArrayType<TArray> ? TArray : never;

export type DeepReadonly<T extends object> = {
    readonly [k in keyof T]: T[k] extends object ? DeepReadonly<T[k]> : T[k];
};

export type DeepPartial<T> = {
    [k in keyof T]?: T[k] extends Array<infer R> ? Array<DeepPartial<R>>
                                                 : T[k] extends object ? DeepPartial<T[k]>
                                                                       : T[k];
};

export type ToFormGroup<T extends object> = FormGroup<{
    [K in keyof T]: T[K] extends object ? ToFormGroup<T[K]> : FormControl<T[K]>;
}>;

export type Override<Source extends object, Target extends object> = Omit<Source, keyof Target> & Target;
