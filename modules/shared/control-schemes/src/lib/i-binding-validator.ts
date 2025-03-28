import { InjectionToken } from '@angular/core';
import { ControlSchemeBinding } from '@app/store';
import { DeepPartial } from '@app/shared-misc';

export interface IBindingValidator {
  isValid(binding: DeepPartial<ControlSchemeBinding>): boolean;
}

export const BINDING_VALIDATOR = new InjectionToken<IBindingValidator>('BINDING_VALIDATOR');
