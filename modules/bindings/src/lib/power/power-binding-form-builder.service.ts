import { Injectable } from '@angular/core';
import { FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ControlSchemePowerBinding, PowerBindingInputAction } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

import { CommonBindingsFormControlsBuilderService } from '../common';
import { IBindingFormBuilder } from '../i-binding-form-builder';
import { PowerBindingForm } from './power-binding-form';

export const NO_INPUTS_SET_POWER_ERROR = 'NO_SET_POWER_INPUTS_ERROR';

@Injectable()
export class PowerBindingFormBuilderService implements IBindingFormBuilder<PowerBindingForm> {
  constructor(
    private readonly formBuilder: FormBuilder,
    private commonFormControlBuilder: CommonBindingsFormControlsBuilderService,
    private readonly controlSchemeFormBuilder: ControlSchemeFormBuilderService,
  ) {}

  public build(): PowerBindingForm {
    return this.formBuilder.group({
      inputs: this.formBuilder.group(
        {
          [PowerBindingInputAction.Forwards]: this.commonFormControlBuilder.optionalInputFormGroup(),
          [PowerBindingInputAction.Backwards]: this.commonFormControlBuilder.optionalInputFormGroup(),
        },
        {
          validators: this.createInputsValidators(),
        },
      ),
      hubId: this.controlSchemeFormBuilder.hubIdControl(),
      portId: this.controlSchemeFormBuilder.portIdControl(),
      maxPower: this.commonFormControlBuilder.powerControl(),
      invert: this.commonFormControlBuilder.toggleControl(),
      modeId: this.commonFormControlBuilder.modeIdControl(),
    });
  }

  public patchForm(form: PowerBindingForm, patch: ControlSchemePowerBinding): void {
    form.patchValue(patch);
    this.commonFormControlBuilder.patchInputPipes(
      form.controls.inputs.controls[PowerBindingInputAction.Forwards].controls.inputPipes,
      patch.inputs?.[PowerBindingInputAction.Forwards]?.inputPipes ?? [],
    );
    this.commonFormControlBuilder.patchInputPipes(
      form.controls.inputs.controls[PowerBindingInputAction.Backwards].controls.inputPipes,
      patch.inputs?.[PowerBindingInputAction.Backwards]?.inputPipes ?? [],
    );
  }

  private createInputsValidators(): ValidatorFn {
    const VALIDATOR = (inputsGroup: PowerBindingForm['controls']['inputs']): ValidationErrors | null => {
      const forwards = inputsGroup.value[PowerBindingInputAction.Forwards];
      const backwards = inputsGroup.value[PowerBindingInputAction.Backwards];

      if (forwards?.controllerId === null && backwards?.controllerId === null) {
        return { [NO_INPUTS_SET_POWER_ERROR]: true };
      }
      return null;
    };
    // ValidatorFn expects an AbstractControl as the first argument, which is not typed, but it is a subclass of FormGroup
    // So we can safely cast it to ValidatorFn and keep the type safety
    return VALIDATOR as ValidatorFn;
  }
}
