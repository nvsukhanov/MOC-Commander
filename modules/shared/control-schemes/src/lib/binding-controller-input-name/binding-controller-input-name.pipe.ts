import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ControlSchemeBindingInputs, ControlSchemeInput } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { BINDING_CONTROLLER_INPUT_NAME_RESOLVER, IBindingControllerInputNameResolver } from './i-binding-controller-input-name-resolver';

@Pipe({
    standalone: true,
    name: 'bindingControllerInputName',
    pure: true
})
export class BindingControllerInputNamePipe implements PipeTransform {
    constructor(
        @Inject(BINDING_CONTROLLER_INPUT_NAME_RESOLVER) private readonly bindingControllerInputNameProvider: IBindingControllerInputNameResolver
    ) {
    }

    public transform<T extends ControlSchemeBindingType>(
        bindingType: T,
        data: ControlSchemeInput | undefined,
        inputAction: keyof ControlSchemeBindingInputs<T>
    ): Observable<string> {
        if (!data) {
            return of('');
        }
        return this.bindingControllerInputNameProvider.getControllerInputName(
            bindingType,
            inputAction,
            data,
        );
    }
}
