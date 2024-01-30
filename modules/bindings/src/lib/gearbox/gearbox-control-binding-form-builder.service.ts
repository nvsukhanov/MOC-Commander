import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MotorServoEndState } from 'rxpoweredup';
import { DeepPartial } from '@app/shared-misc';
import { ControlSchemeGearboxControlBinding, ControlSchemeInputAction } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

import { CommonBindingsFormControlsBuilderService } from '../common';
import { GearboxControlBindingForm } from './gearbox-binding-form';

@Injectable()
export class GearboxControlBindingFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly commonFormControlsBuilder: CommonBindingsFormControlsBuilderService,
        private readonly controlSchemeFormBuilder: ControlSchemeFormBuilderService
    ) {
    }

    public build(): GearboxControlBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [ControlSchemeInputAction.NextLevel]: this.commonFormControlsBuilder.inputFormGroup(),
                [ControlSchemeInputAction.PrevLevel]: this.commonFormControlsBuilder.optionalInputFormGroup(),
                [ControlSchemeInputAction.Reset]: this.commonFormControlsBuilder.optionalInputFormGroup()
            }),
            hubId: this.controlSchemeFormBuilder.hubIdControl(),
            portId: this.controlSchemeFormBuilder.portIdControl(),
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
            endState: this.commonFormControlsBuilder.servoEndStateControl(MotorServoEndState.hold),
            useAccelerationProfile: this.commonFormControlsBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlsBuilder.toggleControl(),
            initialLevelIndex: this.formBuilder.control<number>(0, {
                nonNullable: true,
                validators: [ Validators.required, Validators.min(0) ]
            })
        });
    }

    public patchForm(
        form: GearboxControlBindingForm,
        binding: DeepPartial<ControlSchemeGearboxControlBinding>
    ): void {
        form.patchValue(binding);
        form.controls.angles.clear();
        if (binding.angles) {
            binding.angles.forEach((angle) =>
                form.controls.angles.push(this.commonFormControlsBuilder.angleControl(angle))
            );
        } else {
            form.controls.angles.push(this.commonFormControlsBuilder.angleControl(0));
            form.controls.initialLevelIndex.setValue(0);
        }
    }
}
