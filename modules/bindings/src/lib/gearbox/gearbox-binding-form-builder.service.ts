import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MotorServoEndState } from 'rxpoweredup';
import { DeepPartial } from '@app/shared-misc';
import { ControlSchemeGearboxBinding, GearboxInputAction } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

import { CommonBindingsFormControlsBuilderService } from '../common';
import { GearboxBindingForm } from './gearbox-binding-form';
import { IBindingFormBuilder } from '../i-binding-form-builder';

@Injectable()
export class GearboxBindingFormBuilderService implements IBindingFormBuilder<GearboxBindingForm> {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly commonFormControlsBuilder: CommonBindingsFormControlsBuilderService,
        private readonly controlSchemeFormBuilder: ControlSchemeFormBuilderService
    ) {
    }

    public build(): GearboxBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [GearboxInputAction.NextGear]: this.commonFormControlsBuilder.inputFormGroup(),
                [GearboxInputAction.PrevGear]: this.commonFormControlsBuilder.optionalInputFormGroup(),
                [GearboxInputAction.Reset]: this.commonFormControlsBuilder.optionalInputFormGroup()
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
        form: GearboxBindingForm,
        binding: DeepPartial<ControlSchemeGearboxBinding>
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
