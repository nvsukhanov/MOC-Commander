import { Injectable } from '@angular/core';
import { FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ControlSchemeSpeedBinding, SpeedBindingInputAction } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

import { CommonBindingsFormControlsBuilderService } from '../common';
import { IBindingFormBuilder } from '../i-binding-form-builder';
import { SpeedBindingForm } from './speed-binding-form';

export const NO_INPUTS_SET_SPEED_ERROR = 'NO_SET_SPEED_INPUTS_ERROR';

@Injectable()
export class SpeedBindingFormBuilderService implements IBindingFormBuilder<SpeedBindingForm> {
  constructor(
    private readonly formBuilder: FormBuilder,
    private commonFormControlBuilder: CommonBindingsFormControlsBuilderService,
    private readonly controlSchemeFormBuilder: ControlSchemeFormBuilderService,
  ) {}

  public build(): SpeedBindingForm {
    return this.formBuilder.group({
      inputs: this.formBuilder.group(
        {
          [SpeedBindingInputAction.Forwards]: this.commonFormControlBuilder.optionalInputFormGroup(),
          [SpeedBindingInputAction.Backwards]: this.commonFormControlBuilder.optionalInputFormGroup(),
          [SpeedBindingInputAction.Brake]: this.commonFormControlBuilder.optionalInputFormGroup(),
        },
        {
          validators: this.createInputsValidators(),
        },
      ),
      hubId: this.controlSchemeFormBuilder.hubIdControl(),
      portId: this.controlSchemeFormBuilder.portIdControl(),
      maxSpeed: this.commonFormControlBuilder.speedControl(),
      invert: this.commonFormControlBuilder.toggleControl(),
      power: this.commonFormControlBuilder.powerControl(),
      useAccelerationProfile: this.commonFormControlBuilder.toggleControl(),
      useDecelerationProfile: this.commonFormControlBuilder.toggleControl(),
    });
  }

  public patchForm(form: SpeedBindingForm, patch: ControlSchemeSpeedBinding): void {
    form.patchValue(patch);
    this.commonFormControlBuilder.patchInputPipes(
      form.controls.inputs.controls[SpeedBindingInputAction.Forwards].controls.inputPipes,
      patch.inputs?.[SpeedBindingInputAction.Forwards]?.inputPipes ?? [],
    );
    this.commonFormControlBuilder.patchInputPipes(
      form.controls.inputs.controls[SpeedBindingInputAction.Backwards].controls.inputPipes,
      patch.inputs?.[SpeedBindingInputAction.Backwards]?.inputPipes ?? [],
    );
    this.commonFormControlBuilder.patchInputPipes(
      form.controls.inputs.controls[SpeedBindingInputAction.Brake].controls.inputPipes,
      patch.inputs?.[SpeedBindingInputAction.Brake]?.inputPipes ?? [],
    );
  }

  private createInputsValidators(): ValidatorFn {
    const VALIDATOR = (inputsGroup: SpeedBindingForm['controls']['inputs']): ValidationErrors | null => {
      const forwards = inputsGroup.value[SpeedBindingInputAction.Forwards];
      const backwards = inputsGroup.value[SpeedBindingInputAction.Backwards];
      const brake = inputsGroup.value[SpeedBindingInputAction.Brake];

      if (forwards?.controllerId === null && backwards?.controllerId === null && brake?.controllerId === null) {
        return { [NO_INPUTS_SET_SPEED_ERROR]: true };
      }
      return null;
    };
    // ValidatorFn expects an AbstractControl as the first argument, which is not typed, but it is a subclass of FormGroup
    // So we can safely cast it to ValidatorFn and keep the type safety
    return VALIDATOR as ValidatorFn;
  }
}
