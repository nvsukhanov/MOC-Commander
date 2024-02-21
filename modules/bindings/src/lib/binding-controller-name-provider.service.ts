import { Injectable } from '@angular/core';
import { FullControllerInputNameData, IFullControllerInputNameProvider } from '@app/shared-control-schemes';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBindingInputs, ControlSchemeInput } from '@app/store';

import { GearboxControllerNameResolverService } from './gearbox';
import { IBindingControllerNameResolver } from './i-binding-controller-name-resolver';
import { ServoControllerNameResolverService } from './servo';
import { SetAngleControllerNameResolverService } from './set-angle';
import { SetSpeedControllerNameResolverService } from './set-speed/set-speed-controller-name-resolver.service';
import { StepperControllerNameResolverService } from './stepper';
import { TrainControllerNameResolverService } from './train-control';

@Injectable()
export class BindingControllerNameProviderService implements IFullControllerInputNameProvider {
    private readonly controllerNameProvidersMap: {[ k in ControlSchemeBindingType ]: IBindingControllerNameResolver<k> } = {
        [ControlSchemeBindingType.GearboxControl]: this.gearboxControllerNameResolverService,
        [ControlSchemeBindingType.Servo]: this.servoControllerNameResolverService,
        [ControlSchemeBindingType.SetAngle]: this.setAngleControllerNameResolverService,
        [ControlSchemeBindingType.SetSpeed]: this.setSpeedControllerNameResolverService,
        [ControlSchemeBindingType.Stepper]: this.stepperControllerNameResolverService,
        [ControlSchemeBindingType.TrainControl]: this.trainControllerNameResolverService,
    };

    constructor(
        private readonly gearboxControllerNameResolverService: GearboxControllerNameResolverService,
        private readonly servoControllerNameResolverService: ServoControllerNameResolverService,
        private readonly setAngleControllerNameResolverService: SetAngleControllerNameResolverService,
        private readonly setSpeedControllerNameResolverService: SetSpeedControllerNameResolverService,
        private readonly stepperControllerNameResolverService: StepperControllerNameResolverService,
        private readonly trainControllerNameResolverService: TrainControllerNameResolverService,
    ) {
    }

    public getFullControllerInputNameData<T extends ControlSchemeBindingType>(
        bindingType: T,
        actionType: keyof ControlSchemeBindingInputs<T>,
        data: Omit<ControlSchemeInput, 'gain'>
    ): FullControllerInputNameData {
        return this.controllerNameProvidersMap[bindingType].resolveControllerNameFor(actionType, data) as FullControllerInputNameData;
    }
}
