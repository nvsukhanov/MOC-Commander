import { Injectable } from '@angular/core';
import { ControlSchemeBindingInputs, ControlSchemeInput, ControlSchemeInputAction } from '@app/store';
import { FullControllerInputNameData } from '@app/shared-control-schemes';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingControllerNameResolver } from '../i-binding-controller-name-resolver';
import { ControllerInputNameService } from '../common';

@Injectable()
export class TrainControllerNameResolverService implements IBindingControllerNameResolver<ControlSchemeBindingType.TrainControl> {
    constructor(
        private readonly controllerNameProvider: ControllerInputNameService,
    ) {
    }

    public resolveControllerNameFor(
        action: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.TrainControl>,
        inputConfig: ControlSchemeInput
    ): FullControllerInputNameData {
        switch (action) {
            case ControlSchemeInputAction.NextLevel:
            case ControlSchemeInputAction.PrevLevel:
            case ControlSchemeInputAction.Reset:
                return this.controllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
