import { Injectable } from '@angular/core';
import { ControlSchemeBindingInputs, ControlSchemeInput, ControlSchemeInputAction } from '@app/store';
import { FullControllerInputNameData } from '@app/shared-control-schemes';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingControllerNameResolver } from '../i-binding-controller-name-resolver';
import { ControllerInputNameService, DirectionAwareControllerInputNameService } from '../common';

@Injectable()
export class GearboxControllerNameResolverService implements IBindingControllerNameResolver<ControlSchemeBindingType.GearboxControl> {
    constructor(
        private readonly controllerNameProvider: ControllerInputNameService,
        private readonly directionAwareControllerNameProvider: DirectionAwareControllerInputNameService
    ) {
    }

    public resolveControllerNameFor(
        action: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.GearboxControl>,
        inputConfig: ControlSchemeInput
    ): FullControllerInputNameData {
        switch (action) {
            case ControlSchemeInputAction.NextLevel:
            case ControlSchemeInputAction.PrevLevel:
                return this.directionAwareControllerNameProvider.getFullControllerInputNameData(inputConfig);
            case ControlSchemeInputAction.Reset:
                return this.controllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
