import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { ControllerInputType } from '@app/shared';

import { ServoBindingForm } from '../../types';
import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';

@Injectable({ providedIn: 'root' })
export class ServoOutputControlFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public build(): ServoBindingForm {
        return this.formBuilder.group({
            id: this.commonFormControlBuilder.schemeIdControl(),
            controllerId: this.commonFormControlBuilder.controllerIdControl(),
            inputId: this.commonFormControlBuilder.inputIdControl(),
            inputType: this.commonFormControlBuilder.controllerInputTypeControl(ControllerInputType.Button),
            hubId: this.commonFormControlBuilder.hubIdControl(),
            portId: this.commonFormControlBuilder.portIdControl(),
            range: this.formBuilder.control<number>(MOTOR_LIMITS.maxServoDegreesRange, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(MOTOR_LIMITS.maxServoDegreesRange),
                ]
            }),
            aposCenter: this.formBuilder.control<number>(0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(-MOTOR_LIMITS.maxServoDegreesRange / 2),
                    Validators.max(MOTOR_LIMITS.maxServoDegreesRange / 2),
                ]
            }),
            speed: this.commonFormControlBuilder.speedControl(),
            power: this.commonFormControlBuilder.powerControl(),
            invert: this.commonFormControlBuilder.toggleControl(),
            useAccelerationProfile: this.commonFormControlBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlBuilder.toggleControl()
        });
    }

}
