import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ControllerInputType } from '@app/shared';

import { SetAngleBindingForm } from '../../types';
import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';

@Injectable({ providedIn: 'root' })
export class SetAngleOutputControlFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public build(): SetAngleBindingForm {
        return this.formBuilder.group({
            id: this.commonFormControlBuilder.schemeIdControl(),
            controllerId: this.commonFormControlBuilder.controllerIdControl(),
            inputId: this.commonFormControlBuilder.inputIdControl(),
            inputType: this.commonFormControlBuilder.controllerInputTypeControl(ControllerInputType.Button),
            hubId: this.commonFormControlBuilder.hubIdControl(),
            portId: this.commonFormControlBuilder.portIdControl(),
            angle: this.formBuilder.control<number>(0, {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            speed: this.commonFormControlBuilder.speedControl(),
            power: this.commonFormControlBuilder.powerControl(),
            endState: this.commonFormControlBuilder.servoEndStateControl()
        });
    }
}
