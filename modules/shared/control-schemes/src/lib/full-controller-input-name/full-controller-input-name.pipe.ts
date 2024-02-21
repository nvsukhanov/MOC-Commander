import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ControlSchemeBindingInputs, ControlSchemeInput } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { FULL_CONTROLLER_INPUT_NAME_PROVIDER, IFullControllerInputNameProvider } from './i-full-controller-input-name-provider';

@Pipe({
    standalone: true,
    name: 'fullControllerInputName',
    pure: true
})
export class FullControllerInputNamePipe<T extends ControlSchemeBindingType> implements PipeTransform {
    constructor(
        @Inject(FULL_CONTROLLER_INPUT_NAME_PROVIDER) private readonly fullControllerInputNameProvider: IFullControllerInputNameProvider
    ) {
    }

    public transform(
        bindingType: T,
        data: ControlSchemeInput | undefined,
        inputAction: keyof ControlSchemeBindingInputs<T>
    ): Observable<string> {
        if (!data) {
            return of('');
        }
        return this.fullControllerInputNameProvider.getFullControllerInputNameData(
            bindingType,
            inputAction,
            data,
        ).name$;
    }
}
