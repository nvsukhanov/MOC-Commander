import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IBindingValidator } from '@app/shared-control-schemes';
import { ControlSchemeBinding } from '@app/store';
import { ControlSchemeBindingType, DeepPartial } from '@app/shared-misc';

import { ServoBindingFormBuilderService } from './servo';
import { SetSpeedBindingFormBuilderService } from './set-speed';
import { SetAngleBindingFormBuilderService } from './set-angle';
import { StepperBindingFormBuilderService } from './stepper';
import { TrainControlBindingFormBuilderService } from './train-control';
import { GearboxControlBindingFormBuilderService } from './gearbox';

@Injectable()
export class BindingValidatorService implements IBindingValidator {
    constructor(
        private readonly servoBindingFormBuilder: ServoBindingFormBuilderService,
        private readonly setSpeedBindingFormBuilder: SetSpeedBindingFormBuilderService,
        private readonly setAngleBindingFormBuilder: SetAngleBindingFormBuilderService,
        private readonly stepperBindingFormBuilder: StepperBindingFormBuilderService,
        private readonly trainControlBindingFormBuilder: TrainControlBindingFormBuilderService,
        private readonly gearboxControlBindingFormBuilder: GearboxControlBindingFormBuilderService,
    ) {
    }

    public isValid(
        binding: DeepPartial<ControlSchemeBinding>
    ): boolean {
        if (binding.bindingType === undefined) {
            return false;
        }
        const form = this.buildForm(binding.bindingType);
        // TODO: fix this - this is a bad way to validate - binding is DeepPartial, and we are patching the form with it,
        // while the form is initially valid. So we are not checking if 'binding' is complete.
        form.patchValue(binding);
        return form.valid;
    }

    private buildForm(
        bindingType: ControlSchemeBindingType
    ): FormGroup {
        switch (bindingType) {
            case ControlSchemeBindingType.SetSpeed:
                return this.setSpeedBindingFormBuilder.build();
            case ControlSchemeBindingType.Servo:
                return this.servoBindingFormBuilder.build();
            case ControlSchemeBindingType.SetAngle:
                return this.setAngleBindingFormBuilder.build();
            case ControlSchemeBindingType.Stepper:
                return this.stepperBindingFormBuilder.build();
            case ControlSchemeBindingType.TrainControl:
                return this.trainControlBindingFormBuilder.build();
            case ControlSchemeBindingType.GearboxControl:
                return this.gearboxControlBindingFormBuilder.build();
            default:
                return bindingType satisfies void;
        }
    }
}
