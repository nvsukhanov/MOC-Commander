import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { ControlSchemeStepperBinding } from '@app/store';

import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';
import { StepperBindingForm } from '../types';

@Injectable({ providedIn: 'root' })
export class StepperBindingFormBuilderService {
    private readonly defaultStepDegree = 90;

    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public build(): StepperBindingForm {
        return this.formBuilder.group({
            id: this.commonFormControlBuilder.schemeIdControl(),
            inputs: this.formBuilder.group({
                step: this.commonFormControlBuilder.inputFormGroup()
            }),
            hubId: this.commonFormControlBuilder.hubIdControl(),
            portId: this.commonFormControlBuilder.portIdControl(),
            degree: this.formBuilder.control<number>(this.defaultStepDegree, {
                nonNullable: true,
                validators: [ Validators.required ]
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
        patch: Partial<ControlSchemeStepperBinding>
    ): void {
        form.patchValue(patch);
    }
}