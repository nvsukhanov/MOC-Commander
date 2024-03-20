import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { ControlSchemeBinding } from '@app/store';

export interface IBindingInputNameResolver {
    getBindingActionName<T extends ControlSchemeBinding>(
        binding: T,
        action: keyof T['inputs']
    ): Observable<string>;
}

export const BINDING_INPUT_NAME_RESOLVER = new InjectionToken<IBindingInputNameResolver>('BINDING_INPUT_NAME_RESOLVER');
