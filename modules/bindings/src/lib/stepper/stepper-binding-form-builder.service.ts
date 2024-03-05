import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MotorServoEndState } from 'rxpoweredup';
import { AppValidators, DeepPartial } from '@app/shared-misc';
import { ControlSchemeStepperBinding, StepperInputAction } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

import { CommonBindingsFormControlsBuilderService } from '../common';
import { StepperBindingForm } from './stepper-binding-form';

@Injectable()
export class StepperBindingFormBuilderService {
    private readonly defaultStepDegree = 90;

    private readonly maxStepDegree = 360 * 4;

    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonBindingsFormControlsBuilderService,
        private readonly controlSchemeFormBuilder: ControlSchemeFormBuilderService
    ) {
    }

    public build(): StepperBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [StepperInputAction.Step]: this.commonFormControlBuilder.inputFormGroup()
            }),
            hubId: this.controlSchemeFormBuilder.hubIdControl(),
            portId: this.controlSchemeFormBuilder.portIdControl(),
            degree: this.formBuilder.control<number>(this.defaultStepDegree, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(-this.maxStepDegree),
                    Validators.max(this.maxStepDegree),
                    AppValidators.requireNonZero,
                    AppValidators.requireInteger
                ]
            }),
            power: this.commonFormControlBuilder.powerControl(),
            speed: this.commonFormControlBuilder.speedControl(),
            endState: this.commonFormControlBuilder.servoEndStateControl(MotorServoEndState.hold),
            useAccelerationProfile: this.commonFormControlBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlBuilder.toggleControl()
        });
    }

    public patchForm(
        form: StepperBindingForm,
        patch: DeepPartial<ControlSchemeStepperBinding>
    ): void {
        form.patchValue(patch);
    }
}
