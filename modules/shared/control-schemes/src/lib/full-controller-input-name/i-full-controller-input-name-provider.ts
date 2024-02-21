import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { ControlSchemeBindingInputs, ControlSchemeInput } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

export type FullControllerInputNameData = {
    readonly name$: Observable<string>;
    readonly isConnected$: Observable<boolean>;
};

export interface IFullControllerInputNameProvider {
    getFullControllerInputNameData<T extends ControlSchemeBindingType>(
        bindingType: T,
        actionType: keyof ControlSchemeBindingInputs<T>,
        data: Omit<ControlSchemeInput, 'gain'>
    ): FullControllerInputNameData;
}

export const FULL_CONTROLLER_INPUT_NAME_PROVIDER = new InjectionToken<IFullControllerInputNameProvider>('FULL_CONTROLLER_INPUT_NAME_PROVIDER');
