import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { ControlSchemeBinding } from '@app/store';

export interface IBindingInputSummaryProvider {
    getBindingInputSummary<T extends ControlSchemeBinding>(
        binding: T,
        action: keyof T['inputs']
    ): Observable<string>;
}

export const BINDING_INPUT_SUMMARY_PROVIDER = new InjectionToken<IBindingInputSummaryProvider>('BINDING_INPUT_SUMMARY_PROVIDER');
