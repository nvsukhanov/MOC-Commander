import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeStepperBinding, StepperBindingInputAction } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { StepperBindingForm } from './stepper-binding-form';

@Injectable()
export class StepperBindingFormMapperService {
  constructor(private readonly commonFormMapperService: CommonFormMapperService) {}

  public mapToModel(id: ControlSchemeBinding['id'], form: StepperBindingForm): ControlSchemeStepperBinding {
    const hubId = form.controls.hubId.value;
    const portId = form.controls.portId.value;
    if (hubId === null || portId === null) {
      throw new Error('Hub ID and port ID must be set');
    }
    const result: ControlSchemeStepperBinding = {
      id,
      bindingType: ControlSchemeBindingType.Stepper,
      ...form.getRawValue(),
      hubId,
      portId,
      inputs: {},
    };

    if (form.controls.inputs.controls[StepperBindingInputAction.Cw].controls.controllerId.value !== null) {
      result.inputs[StepperBindingInputAction.Cw] = this.commonFormMapperService.mapInputFormToSchemeInput(
        form.controls.inputs.controls[StepperBindingInputAction.Cw] as InputFormGroup,
      );
    }
    if (form.controls.inputs.controls[StepperBindingInputAction.Ccw].controls.controllerId.value !== null) {
      result.inputs[StepperBindingInputAction.Ccw] = this.commonFormMapperService.mapInputFormToSchemeInput(
        form.controls.inputs.controls[StepperBindingInputAction.Ccw] as InputFormGroup,
      );
    }
    return result;
  }
}
