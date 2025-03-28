import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeSpeedBinding, SpeedBindingInputAction } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { IBindingFormMapper } from '../i-binding-form-mapper';
import { SpeedBindingForm } from './speed-binding-form';

@Injectable()
export class SpeedBindingFormMapperService implements IBindingFormMapper<SpeedBindingForm, ControlSchemeSpeedBinding> {
  constructor(private readonly commonFormMapperService: CommonFormMapperService) {}

  public mapToModel(id: ControlSchemeBinding['id'], form: SpeedBindingForm): ControlSchemeSpeedBinding {
    const hubId = form.controls.hubId.value;
    const portId = form.controls.portId.value;
    if (hubId === null || portId === null) {
      throw new Error('Hub ID and port ID must be set');
    }
    const result: ControlSchemeSpeedBinding = {
      id,
      bindingType: ControlSchemeBindingType.Speed,
      inputs: {},
      hubId,
      portId,
      maxSpeed: form.controls.maxSpeed.getRawValue(),
      invert: form.controls.invert.getRawValue(),
      power: form.controls.power.getRawValue(),
      useAccelerationProfile: form.controls.useAccelerationProfile.getRawValue(),
      useDecelerationProfile: form.controls.useDecelerationProfile.getRawValue(),
    };
    if (form.controls.inputs.controls[SpeedBindingInputAction.Forwards].controls.controllerId.value !== null) {
      result.inputs[SpeedBindingInputAction.Forwards] = this.commonFormMapperService.mapInputFormToSchemeInput(
        form.controls.inputs.controls[SpeedBindingInputAction.Forwards] as InputFormGroup,
      );
    }
    if (form.controls.inputs.controls[SpeedBindingInputAction.Backwards].controls.controllerId.value !== null) {
      result.inputs[SpeedBindingInputAction.Backwards] = this.commonFormMapperService.mapInputFormToSchemeInput(
        form.controls.inputs.controls[SpeedBindingInputAction.Backwards] as InputFormGroup,
      );
    }
    if (form.controls.inputs.controls[SpeedBindingInputAction.Brake].controls.controllerId.value !== null) {
      result.inputs[SpeedBindingInputAction.Brake] = this.commonFormMapperService.mapInputFormToSchemeInput(
        form.controls.inputs.controls[SpeedBindingInputAction.Brake] as InputFormGroup,
      );
    }
    return result;
  }
}
