import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IBindingValidator } from '@app/shared-control-schemes';
import { ControlSchemeBinding } from '@app/store';
import { ControlSchemeBindingType, DeepPartial } from '@app/shared-misc';

import { ServoBindingFormBuilderService } from './servo';
import { SpeedBindingFormBuilderService } from './speed';
import { SetAngleBindingFormBuilderService } from './set-angle';
import { StepperBindingFormBuilderService } from './stepper';
import { TrainBindingFormBuilderService } from './train';
import { GearboxBindingFormBuilderService } from './gearbox';
import { IBindingFormBuilder } from './i-binding-form-builder';
import { AccelerateBindingFormBuilderService } from './accelerate';

@Injectable()
export class BindingValidatorService implements IBindingValidator {
    constructor(
        private readonly servoBindingFormBuilder: ServoBindingFormBuilderService,
        private readonly speedBindingFormBuilder: SpeedBindingFormBuilderService,
        private readonly setAngleBindingFormBuilder: SetAngleBindingFormBuilderService,
        private readonly stepperBindingFormBuilder: StepperBindingFormBuilderService,
        private readonly trainBindingFormBuilder: TrainBindingFormBuilderService,
        private readonly gearboxBindingFormBuilder: GearboxBindingFormBuilderService,
        private readonly accelerateBindingFormBuilder: AccelerateBindingFormBuilderService
    ) {
    }

    public isValid(
        binding: DeepPartial<ControlSchemeBinding>
    ): boolean {
        if (binding.bindingType === undefined) {
            return false;
        }
        const formBuilder = this.getFormBuilder(binding.bindingType);
        const form = formBuilder.build();
        // TODO: fix this - this is a bad way to validate - binding is DeepPartial, and we are patching the form with it,
        // while the form is initially valid. So we are not checking if 'binding' is complete.
        formBuilder.patchForm(form, binding);
        form.updateValueAndValidity();
        return form.valid;
    }

    private getFormBuilder(
        bindingType: ControlSchemeBindingType
    ): IBindingFormBuilder<FormGroup> {
        switch (bindingType) {
            case ControlSchemeBindingType.Speed:
                return this.speedBindingFormBuilder;
            case ControlSchemeBindingType.Servo:
                return this.servoBindingFormBuilder;
            case ControlSchemeBindingType.SetAngle:
                return this.setAngleBindingFormBuilder;
            case ControlSchemeBindingType.Stepper:
                return this.stepperBindingFormBuilder;
            case ControlSchemeBindingType.Train:
                return this.trainBindingFormBuilder;
            case ControlSchemeBindingType.Gearbox:
                return this.gearboxBindingFormBuilder;
            case ControlSchemeBindingType.Accelerate:
                return this.accelerateBindingFormBuilder;
            default:
                return bindingType satisfies void;
        }
    }
}
