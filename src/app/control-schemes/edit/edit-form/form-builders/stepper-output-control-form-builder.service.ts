import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { ControllerInputType } from '@app/shared';

import { StepperBindingForm } from '../../types';
import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';

@Injectable({ providedIn: 'root' })
export class StepperOutputControlFormBuilderService {
    private readonly defaultStepDegree = 90;

    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public build(): StepperBindingForm {
        return this.formBuilder.group({
            id: this.commonFormControlBuilder.schemeIdControl(),
            controllerId: this.commonFormControlBuilder.controllerIdControl(),
            inputId: this.commonFormControlBuilder.inputIdControl(),
            inputType: this.commonFormControlBuilder.controllerInputTypeControl(ControllerInputType.Button),
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
}
