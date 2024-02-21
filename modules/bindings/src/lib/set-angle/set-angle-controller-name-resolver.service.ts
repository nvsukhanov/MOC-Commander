import { Injectable } from '@angular/core';
import { ControlSchemeBindingInputs, ControlSchemeInput, ControlSchemeInputAction } from '@app/store';
import { FullControllerInputNameData } from '@app/shared-control-schemes';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingControllerNameResolver } from '../i-binding-controller-name-resolver';
import { ControllerInputNameService } from '../common';

@Injectable()
export class SetAngleControllerNameResolverService implements IBindingControllerNameResolver<ControlSchemeBindingType.SetAngle> {
    constructor(
        private readonly controllerNameProvider: ControllerInputNameService,
    ) {
    }

    public resolveControllerNameFor(
        action: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.SetAngle>,
        inputConfig: ControlSchemeInput
    ): FullControllerInputNameData {
        switch (action) {
            case ControlSchemeInputAction.SetAngle:
                return this.controllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
