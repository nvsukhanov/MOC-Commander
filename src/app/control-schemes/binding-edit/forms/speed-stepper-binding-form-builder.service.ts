import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ControlSchemeSpeedStepperBinding } from '@app/store';

import { SpeedStepperBindingForm } from '../types';
import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';

@Injectable({ providedIn: 'root' })
export class SpeedStepperBindingFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public build(): SpeedStepperBindingForm {
        return this.formBuilder.group({
            id: this.commonFormControlBuilder.schemeIdControl(),
            inputs: this.formBuilder.group({
                nextSpeed: this.commonFormControlBuilder.inputFormGroup(),
                prevSpeed: this.commonFormControlBuilder.optionalInputFormGroup(),
                stop: this.commonFormControlBuilder.optionalInputFormGroup()
            }),
            hubId: this.commonFormControlBuilder.hubIdControl(),
            portId: this.commonFormControlBuilder.portIdControl(),
            steps: this.formBuilder.array<FormControl<number>>([
                this.commonFormControlBuilder.speedStepControl(0)
            ], {
                validators: [
                    Validators.required,
                    Validators.minLength(2)
                ]
            }),
            power: this.commonFormControlBuilder.powerControl(),
            useAccelerationProfile: this.commonFormControlBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlBuilder.toggleControl(),
            initialStepIndex: this.formBuilder.control<number>(0, { nonNullable: true })
        });
    }

    public patchForm(
        form: SpeedStepperBindingForm,
        patch: Partial<ControlSchemeSpeedStepperBinding>
    ): void {
        form.patchValue(patch);
        form.controls.steps.clear();
        if (patch.steps) {
            patch.steps.forEach((step) =>
                form.controls.steps.push(this.commonFormControlBuilder.speedStepControl(step))
            );
        } else {
            form.controls.steps.push(this.commonFormControlBuilder.speedStepControl(0));
            form.controls.initialStepIndex.setValue(0);
        }
    }
}
