import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ControlSchemeInputAction, ControlSchemeSpeedShiftBinding } from '@app/store';
import { DeepPartial } from '@app/shared';

import { SpeedShiftBindingForm } from '../types';
import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';

@Injectable({ providedIn: 'root' })
export class SpeedShiftBindingFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlsBuilder: CommonFormControlsBuilderService
    ) {
    }

    public build(): SpeedShiftBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [ControlSchemeInputAction.NextLevel]: this.commonFormControlsBuilder.inputFormGroup(),
                [ControlSchemeInputAction.PrevLevel]: this.commonFormControlsBuilder.optionalInputFormGroup(),
                [ControlSchemeInputAction.Reset]: this.commonFormControlsBuilder.optionalInputFormGroup()
            }),
            hubId: this.commonFormControlsBuilder.hubIdControl(),
            portId: this.commonFormControlsBuilder.portIdControl(),
            levels: this.formBuilder.array<FormControl<number>>([
                this.commonFormControlsBuilder.speedControl(0)
            ], {
                validators: [
                    Validators.required,
                    Validators.minLength(2)
                ]
            }),
            power: this.commonFormControlsBuilder.powerControl(),
            loopingMode: this.commonFormControlsBuilder.loopingModeControl(),
            useAccelerationProfile: this.commonFormControlsBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlsBuilder.toggleControl(),
            initialStepIndex: this.formBuilder.control<number>(0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0)
                ]
            })
        });
    }

    public patchForm(
        form: SpeedShiftBindingForm,
        patch: DeepPartial<ControlSchemeSpeedShiftBinding>
    ): void {
        form.patchValue(patch);
        form.controls.levels.clear();
        if (patch.levels) {
            patch.levels.forEach((speed) =>
                form.controls.levels.push(this.commonFormControlsBuilder.speedControl(speed))
            );
        } else {
            form.controls.levels.push(this.commonFormControlsBuilder.speedControl(0));
            form.controls.initialStepIndex.setValue(0);
        }
    }
}
