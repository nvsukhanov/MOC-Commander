import { Injectable } from '@angular/core';
import { ControlSchemeBindingInputs, ControlSchemeInput, ControlSchemeInputAction } from '@app/store';
import { FullControllerInputNameData } from '@app/shared-control-schemes';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingControllerNameResolver } from '../i-binding-controller-name-resolver';
import { DirectionAwareControllerInputNameService } from '../common';

@Injectable()
export class ServoControllerNameResolverService implements IBindingControllerNameResolver<ControlSchemeBindingType.Servo> {
    constructor(
        private readonly controllerNameProvider: DirectionAwareControllerInputNameService,
    ) {
    }

    public resolveControllerNameFor(
        action: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Servo>,
        inputConfig: ControlSchemeInput
    ): FullControllerInputNameData {
        switch (action) {
            case ControlSchemeInputAction.ServoCw:
            case ControlSchemeInputAction.ServoCcw:
                return this.controllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
