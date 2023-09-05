import { MOTOR_LIMITS } from 'rxpoweredup';
import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { ControlSchemeInputAction, ControlSchemeServoBinding } from '@app/store';
import { DeepPartial } from '@app/shared';

import { ServoBindingForm } from '../types';
import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';
import { ControlSchemeValidators } from '../../validation';

@Injectable({ providedIn: 'root' })
export class ServoBindingFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public build(): ServoBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [ControlSchemeInputAction.Servo]: this.commonFormControlBuilder.inputFormGroup()
            }),
            hubId: this.commonFormControlBuilder.hubIdControl(),
            portId: this.commonFormControlBuilder.portIdControl(),
            range: this.formBuilder.control<number>(MOTOR_LIMITS.maxServoDegreesRange, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(MOTOR_LIMITS.minServoDegreesRange),
                    Validators.max(MOTOR_LIMITS.maxServoDegreesRange),
                    ControlSchemeValidators.requireInteger,
                    ControlSchemeValidators.requireNonZero
                ]
            }),
            aposCenter: this.formBuilder.control<number>(0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(-MOTOR_LIMITS.maxServoDegreesRange / 2),
                    Validators.max(MOTOR_LIMITS.maxServoDegreesRange / 2),
                    ControlSchemeValidators.requireInteger,
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
