import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ControlSchemeAngleShiftBinding, ControlSchemeInputAction } from '@app/store';
import { DeepPartial } from '@app/shared';

import { AngleShiftBindingForm } from '../types';
import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';

@Injectable({ providedIn: 'root' })
export class AngleShiftBindingFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly commonFormControlsBuilder: CommonFormControlsBuilderService
    ) {
    }

    public build(): AngleShiftBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [ControlSchemeInputAction.NextLevel]: this.commonFormControlsBuilder.inputFormGroup(),
                [ControlSchemeInputAction.PrevLevel]: this.commonFormControlsBuilder.optionalInputFormGroup()
            }),
            hubId: this.commonFormControlsBuilder.hubIdControl(),
            portId: this.commonFormControlsBuilder.portIdControl(),
            angles: this.formBuilder.array<FormControl<number>>([
                this.commonFormControlsBuilder.angleControl(0)
            ], {
                validators: [
                    Validators.required,
                    Validators.minLength(2)
                ]
            }),
            speed: this.commonFormControlsBuilder.speedControl(),
            power: this.commonFormControlsBuilder.powerControl(),
            loopingMode: this.commonFormControlsBuilder.loopingModeControl(),
            endState: this.commonFormControlsBuilder.servoEndStateControl(),
            useAccelerationProfile: this.commonFormControlsBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlsBuilder.toggleControl(),
            initialStepIndex: this.formBuilder.control<number>(0, {
                nonNullable: true,
                validators: [ Validators.required, Validators.min(0) ]
            })
        });
    }

    public patchForm(
        form: AngleShiftBindingForm,
        binding: DeepPartial<ControlSchemeAngleShiftBinding>
    ): void {
        form.patchValue(binding);
        form.controls.angles.clear();
        if (binding.angles) {
            binding.angles.forEach((angle) =>
                form.controls.angles.push(this.commonFormControlsBuilder.angleControl(angle))
            );
        } else {
            form.controls.angles.push(this.commonFormControlsBuilder.angleControl(0));
            form.controls.initialStepIndex.setValue(0);
        }
    }
}
