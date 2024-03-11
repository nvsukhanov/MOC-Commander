import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ControlSchemeTrainBinding, TrainBindingInputAction } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

import { CommonBindingsFormControlsBuilderService } from '../common';
import { TrainBindingForm } from './train-binding-form';
import { IBindingFormBuilder } from '../i-binding-form-builder';

@Injectable()
export class TrainBindingFormBuilderService implements IBindingFormBuilder<TrainBindingForm> {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly commonFormControlsBuilder: CommonBindingsFormControlsBuilderService,
        private readonly controlSchemeFormBuilder: ControlSchemeFormBuilderService
    ) {
    }

    public build(): TrainBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [TrainBindingInputAction.NextSpeed]: this.commonFormControlsBuilder.inputFormGroup(),
                [TrainBindingInputAction.PrevSpeed]: this.commonFormControlsBuilder.optionalInputFormGroup(),
                [TrainBindingInputAction.Reset]: this.commonFormControlsBuilder.optionalInputFormGroup()
            }),
            hubId: this.controlSchemeFormBuilder.hubIdControl(),
            portId: this.controlSchemeFormBuilder.portIdControl(),
            levels: this.formBuilder.array<FormControl<number>>([
                this.commonFormControlsBuilder.speedLevelControl(0)
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
            initialLevelIndex: this.formBuilder.control<number>(0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0)
                ]
            })
        });
    }

    public patchForm(
        form: TrainBindingForm,
        patch: ControlSchemeTrainBinding
    ): void {
        form.patchValue(patch);
        form.controls.levels.clear();
        patch.levels.forEach((speed) =>
            form.controls.levels.push(this.commonFormControlsBuilder.speedLevelControl(speed))
        );
        this.commonFormControlsBuilder.patchInputPipes(
            form.controls.inputs.controls[TrainBindingInputAction.NextSpeed].controls.inputPipes,
            patch.inputs?.[TrainBindingInputAction.NextSpeed]?.inputPipes ?? []
        );
        this.commonFormControlsBuilder.patchInputPipes(
            form.controls.inputs.controls[TrainBindingInputAction.PrevSpeed].controls.inputPipes,
            patch.inputs?.[TrainBindingInputAction.PrevSpeed]?.inputPipes ?? []
        );
    }
}
