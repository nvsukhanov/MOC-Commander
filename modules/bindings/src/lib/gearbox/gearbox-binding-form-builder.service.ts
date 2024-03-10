import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MotorServoEndState } from 'rxpoweredup';
import { ControlSchemeGearboxBinding, GearboxBindingInputAction } from '@app/store';
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
                [GearboxBindingInputAction.NextGear]: this.commonFormControlsBuilder.inputFormGroup(),
                [GearboxBindingInputAction.PrevGear]: this.commonFormControlsBuilder.optionalInputFormGroup(),
                [GearboxBindingInputAction.Reset]: this.commonFormControlsBuilder.optionalInputFormGroup()
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
        binding: ControlSchemeGearboxBinding
    ): void {
        form.patchValue(binding);
        form.controls.angles.clear();
        binding.angles.forEach((angle) =>
            form.controls.angles.push(this.commonFormControlsBuilder.angleControl(angle))
        );
        this.commonFormControlsBuilder.patchInputPipes(
            form.controls.inputs.controls[GearboxBindingInputAction.NextGear].controls.inputPipes,
            binding.inputs[GearboxBindingInputAction.NextGear]?.inputPipes ?? []
        );
        this.commonFormControlsBuilder.patchInputPipes(
            form.controls.inputs.controls[GearboxBindingInputAction.PrevGear].controls.inputPipes,
            binding.inputs[GearboxBindingInputAction.PrevGear]?.inputPipes ?? []
        );
        this.commonFormControlsBuilder.patchInputPipes(
            form.controls.inputs.controls[GearboxBindingInputAction.Reset].controls.inputPipes,
            binding.inputs[GearboxBindingInputAction.Reset]?.inputPipes ?? []
        );
    }
}
