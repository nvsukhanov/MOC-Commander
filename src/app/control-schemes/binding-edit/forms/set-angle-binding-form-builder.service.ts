import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { SetAngleBindingForm } from '../types';
import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';

@Injectable({ providedIn: 'root' })
export class SetAngleBindingFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public build(): SetAngleBindingForm {
        return this.formBuilder.group({
            id: this.commonFormControlBuilder.schemeIdControl(),
            inputs: this.formBuilder.group({
                setAngle: this.commonFormControlBuilder.inputFormGroup()
            }),
            hubId: this.commonFormControlBuilder.hubIdControl(),
            portId: this.commonFormControlBuilder.portIdControl(),
            angle: this.formBuilder.control<number>(0, {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            speed: this.commonFormControlBuilder.speedControl(),
            power: this.commonFormControlBuilder.powerControl(),
            endState: this.commonFormControlBuilder.servoEndStateControl(),
            useAccelerationProfile: this.commonFormControlBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlBuilder.toggleControl()
        });
    }
}
