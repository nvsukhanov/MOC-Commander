import { Injectable } from '@angular/core';
import { ControlSchemeBindingInputs, ControlSchemeInput, ControlSchemeInputAction } from '@app/store';
import { FullControllerInputNameData } from '@app/shared-control-schemes';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingControllerNameResolver } from '../i-binding-controller-name-resolver';
import { DirectionAwareControllerInputNameService } from '../common';

@Injectable()
export class SetSpeedControllerNameResolverService implements IBindingControllerNameResolver<ControlSchemeBindingType.SetSpeed> {
    constructor(
        private readonly controllerNameProvider: DirectionAwareControllerInputNameService,
    ) {
    }

    public resolveControllerNameFor(
        action: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.SetSpeed>,
        inputConfig: ControlSchemeInput
    ): FullControllerInputNameData {
        switch (action) {
            case ControlSchemeInputAction.Forwards:
            case ControlSchemeInputAction.Backwards:
            case ControlSchemeInputAction.Brake:
                return this.controllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
