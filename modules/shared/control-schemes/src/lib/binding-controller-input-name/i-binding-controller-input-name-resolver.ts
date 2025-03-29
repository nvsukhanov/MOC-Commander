import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { ControlSchemeBindingInputs, ControlSchemeInputConfig } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

export interface IBindingControllerInputNameResolver {
  getControllerInputName<T extends ControlSchemeBindingType>(
    bindingType: T,
    actionType: keyof ControlSchemeBindingInputs<T>,
    data: ControlSchemeInputConfig,
  ): Observable<string>;
}

export const BINDING_CONTROLLER_INPUT_NAME_RESOLVER = new InjectionToken<IBindingControllerInputNameResolver>(
  'BINDING_CONTROLLER_INPUT_NAME_RESOLVER',
);
