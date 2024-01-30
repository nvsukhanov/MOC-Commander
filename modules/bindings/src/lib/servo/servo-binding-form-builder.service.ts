import { MOTOR_LIMITS } from 'rxpoweredup';
import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { AppValidators, DeepPartial } from '@app/shared-misc';
import { ControlSchemeInputAction, ControlSchemeServoBinding } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

import { CommonBindingsFormControlsBuilderService } from '../common';
import { ServoBindingForm } from './servo-binding-form';

@Injectable({ providedIn: 'root' })
export class ServoBindingFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonBindingsFormControlsBuilderService,
        private readonly controlSchemeFormBuilder: ControlSchemeFormBuilderService
    ) {
    }

    public build(): ServoBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [ControlSchemeInputAction.Servo]: this.commonFormControlBuilder.inputFormGroup()
            }),
            hubId: this.controlSchemeFormBuilder.hubIdControl(),
            portId: this.controlSchemeFormBuilder.portIdControl(),
            calibrateOnStart: this.commonFormControlBuilder.toggleControl(true),
            range: this.formBuilder.control<number>(MOTOR_LIMITS.maxServoDegreesRange, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(MOTOR_LIMITS.minServoDegreesRange),
                    Validators.max(MOTOR_LIMITS.maxServoDegreesRange),
                    AppValidators.requireInteger,
                    AppValidators.requireNonZero
                ]
            }),
            aposCenter: this.formBuilder.control<number>(0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(-MOTOR_LIMITS.maxServoDegreesRange / 2),
                    Validators.max(MOTOR_LIMITS.maxServoDegreesRange / 2),
                    AppValidators.requireInteger,
                ]
            }),
            speed: this.commonFormControlBuilder.speedControl(),
            power: this.commonFormControlBuilder.powerControl(),
            invert: this.commonFormControlBuilder.toggleControl(),
            useAccelerationProfile: this.commonFormControlBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlBuilder.toggleControl()
        });
    }

    public patchForm(
        form: ServoBindingForm,
        patch: DeepPartial<ControlSchemeServoBinding>
    ): void {
        form.patchValue(patch);
    }

}
