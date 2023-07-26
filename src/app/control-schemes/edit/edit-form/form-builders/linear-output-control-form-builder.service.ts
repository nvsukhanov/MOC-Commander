import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ControllerInputType } from '@app/shared';

import { LinearBindingForm } from '../../types';
import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';

@Injectable({ providedIn: 'root' })
export class LinearOutputControlFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public build(): LinearBindingForm {
        return this.formBuilder.group({
            id: this.commonFormControlBuilder.schemeIdControl(),
            controllerId: this.commonFormControlBuilder.controllerIdControl(),
            inputId: this.commonFormControlBuilder.inputIdControl(),
            inputType: this.commonFormControlBuilder.controllerInputTypeControl(ControllerInputType.Button),
            hubId: this.commonFormControlBuilder.hubIdControl(),
            portId: this.commonFormControlBuilder.portIdControl(),
            maxSpeed: this.commonFormControlBuilder.speedControl(),
            isToggle: this.commonFormControlBuilder.toggleControl(),
            invert: this.commonFormControlBuilder.toggleControl(),
            power: this.commonFormControlBuilder.powerControl(),
            useAccelerationProfile: this.commonFormControlBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlBuilder.toggleControl()
        });
    }
}
