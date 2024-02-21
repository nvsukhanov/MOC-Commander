import { Injectable } from '@angular/core';
import { ControlSchemeBindingInputs, ControlSchemeInput, ControlSchemeInputAction } from '@app/store';
import { FullControllerInputNameData } from '@app/shared-control-schemes';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingControllerNameResolver } from '../i-binding-controller-name-resolver';
import { DirectionAwareControllerInputNameService } from '../common';

@Injectable()
export class StepperControllerNameResolverService implements IBindingControllerNameResolver<ControlSchemeBindingType.Stepper> {
    constructor(
        private readonly directionAwareControllerNameProvider: DirectionAwareControllerInputNameService
    ) {
    }

    public resolveControllerNameFor(
        action: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Stepper>,
        inputConfig: ControlSchemeInput
    ): FullControllerInputNameData {
        switch (action) {
            case ControlSchemeInputAction.Step:
                return this.directionAwareControllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
