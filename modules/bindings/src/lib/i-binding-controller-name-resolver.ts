import { InjectionToken } from '@angular/core';
import { ControlSchemeBindingInputs, ControlSchemeInput } from '@app/store';
import { FullControllerInputNameData } from '@app/shared-control-schemes';
import { ControlSchemeBindingType } from '@app/shared-misc';

export interface IBindingControllerNameResolver<T extends ControlSchemeBindingType> {
    resolveControllerNameFor(
        action: keyof ControlSchemeBindingInputs<T>,
        inputConfig: Omit<ControlSchemeInput, 'gain'>
    ): FullControllerInputNameData;
}

export const BINDING_CONTROLLER_NAME_RESOLVER =
    new InjectionToken<IBindingControllerNameResolver<ControlSchemeBindingType>>('BINDING_CONTROLLER_NAME_RESOLVER');
