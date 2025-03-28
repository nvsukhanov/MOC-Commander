import { InjectionToken } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

export interface IBindingTypeToL10nKeyMapper {
  mapBindingTypeToL10nKey(bindingType: ControlSchemeBindingType): string;
}

export const BINDING_TYPE_TO_L10N_KEY_MAPPER = new InjectionToken<IBindingTypeToL10nKeyMapper>('BINDING_TYPE_TO_L10N_KEY_MAPPER');
