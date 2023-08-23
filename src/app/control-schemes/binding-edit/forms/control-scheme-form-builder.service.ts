import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ControlSchemeBindingType } from '@app/shared';
import { ControlSchemeBinding } from '@app/store';

import { ControlSchemeBindingForm } from '../types';
import { ServoBindingFormBuilderService } from './servo-binding-form-builder.service';
import { SetSpeedBindingFormBuilderService } from './set-speed-binding-form-builder.service';
import { SetAngleBindingFormBuilderService } from './set-angle-binding-form-builder.service';
import { StepperBindingFormBuilderService } from './stepper-binding-form-builder.service';
import { SpeedShiftBindingFormBuilderService } from './speed-shift-binding-form-builder.service';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly servoBindingFormBuilder: ServoBindingFormBuilderService,
        private readonly setSpeedBindingFormBuilder: SetSpeedBindingFormBuilderService,
        private readonly setAngleBindingFormBuilder: SetAngleBindingFormBuilderService,
        private readonly stepperBindingFormBuilder: StepperBindingFormBuilderService,
        private readonly speedShiftBindingFormBuilder: SpeedShiftBindingFormBuilderService,
    ) {
    }

    public createBindingForm(): ControlSchemeBindingForm {
        return this.formBuilder.group({
            bindingFormOperationMode: this.formBuilder.control<ControlSchemeBindingType>(ControlSchemeBindingType.SetSpeed, { nonNullable: true }),
            [ControlSchemeBindingType.SetSpeed]: this.setSpeedBindingFormBuilder.build(),
            [ControlSchemeBindingType.Servo]: this.servoBindingFormBuilder.build(),
            [ControlSchemeBindingType.SetAngle]: this.setAngleBindingFormBuilder.build(),
            [ControlSchemeBindingType.Stepper]: this.stepperBindingFormBuilder.build(),
            [ControlSchemeBindingType.SpeedShift]: this.speedShiftBindingFormBuilder.build()
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
            case ControlSchemeBindingType.SetSpeed:
                this.setSpeedBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.SetSpeed], patch);
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
            case ControlSchemeBindingType.SpeedShift:
                this.speedShiftBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.SpeedShift], patch);
                break;
            default:
                return patch.operationMode satisfies void;
        }
    }
}
