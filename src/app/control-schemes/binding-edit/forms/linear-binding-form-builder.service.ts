import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ControlSchemeLinearBinding } from '@app/store';

import { LinearBindingForm } from '../types';
import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';

@Injectable({ providedIn: 'root' })
export class LinearBindingFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public build(): LinearBindingForm {
        return this.formBuilder.group({
            id: this.commonFormControlBuilder.schemeIdControl(),
            inputs: this.formBuilder.group({
                accelerate: this.commonFormControlBuilder.inputFormGroup(),
                brake: this.commonFormControlBuilder.optionalInputFormGroup(),
            }),
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

    public patchForm(
        form: LinearBindingForm,
        patch: Partial<ControlSchemeLinearBinding>
    ): void {
        form.patchValue(patch);
    }
}
