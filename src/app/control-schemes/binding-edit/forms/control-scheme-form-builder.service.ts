import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ControlSchemeBindingType } from '@app/shared';
import { ControlSchemeBinding } from '@app/store';

import { ControlSchemeBindingForm } from '../types';
import { ServoBindingFormBuilderService } from './servo-binding-form-builder.service';
import { LinearBindingFormBuilderService } from './linear-binding-form-builder.service';
import { SetAngleBindingFormBuilderService } from './set-angle-binding-form-builder.service';
import { StepperBindingFormBuilderService } from './stepper-binding-form-builder.service';
import { SpeedStepperBindingFormBuilderService } from './speed-stepper-binding-form-builder.service';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly servoBindingFormBuilder: ServoBindingFormBuilderService,
        private readonly linearBindingFormBuilder: LinearBindingFormBuilderService,
        private readonly setAngleBindingFormBuilder: SetAngleBindingFormBuilderService,
        private readonly stepperBindingFormBuilder: StepperBindingFormBuilderService,
        private readonly speedStepperBindingFormBuilder: SpeedStepperBindingFormBuilderService,
    ) {
    }

    public createBindingForm(): ControlSchemeBindingForm {
        return this.formBuilder.group({
            bindingFormOperationMode: this.formBuilder.control<ControlSchemeBindingType>(ControlSchemeBindingType.Linear, { nonNullable: true }),
            [ControlSchemeBindingType.Linear]: this.linearBindingFormBuilder.build(),
            [ControlSchemeBindingType.Servo]: this.servoBindingFormBuilder.build(),
            [ControlSchemeBindingType.SetAngle]: this.setAngleBindingFormBuilder.build(),
            [ControlSchemeBindingType.Stepper]: this.stepperBindingFormBuilder.build(),
            [ControlSchemeBindingType.SpeedStepper]: this.speedStepperBindingFormBuilder.build()
        });
    }

    public patchForm(
        form: ControlSchemeBindingForm,
        patch: Partial<ControlSchemeBinding>
    ): void {
        if (patch.operationMode) {
            form.controls.bindingFormOperationMode.patchValue(patch.operationMode);
        }
        switch (patch.operationMode) {
            case ControlSchemeBindingType.Linear:
                this.linearBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.Linear], patch);
                break;
            case ControlSchemeBindingType.Servo:
                this.servoBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.Servo], patch);
                break;
            case ControlSchemeBindingType.SetAngle:
                this.setAngleBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.SetAngle], patch);
                break;
            case ControlSchemeBindingType.Stepper:
                this.stepperBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.Stepper], patch);
                break;
            case ControlSchemeBindingType.SpeedStepper:
                this.speedStepperBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.SpeedStepper], patch);
                break;
            default:
                return patch.operationMode satisfies void;
        }
    }
}
