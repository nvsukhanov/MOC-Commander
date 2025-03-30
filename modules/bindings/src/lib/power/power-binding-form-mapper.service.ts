import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemePowerBinding, PowerBindingInputAction } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { IBindingFormMapper } from '../i-binding-form-mapper';
import { PowerBindingForm } from './power-binding-form';

@Injectable()
export class PowerBindingFormMapperService implements IBindingFormMapper<PowerBindingForm, ControlSchemePowerBinding> {
  constructor(private readonly commonFormMapperService: CommonFormMapperService) {}

  public mapToModel(id: ControlSchemeBinding['id'], form: PowerBindingForm): ControlSchemePowerBinding {
    const hubId = form.controls.hubId.value;
    const portId = form.controls.portId.value;
    if (hubId === null || portId === null) {
      throw new Error('Hub ID and port ID must be set');
    }
    const modeId = form.controls.modeId.value;
    if (modeId === null) {
      throw new Error('Mode ID must be set');
    }
    const result: ControlSchemePowerBinding = {
      id,
      bindingType: ControlSchemeBindingType.Power,
      inputs: {},
      hubId,
      portId,
      maxPower: form.controls.maxPower.getRawValue(),
      invert: form.controls.invert.getRawValue(),
      modeId,
    };
    if (form.controls.inputs.controls[PowerBindingInputAction.Forwards].controls.controllerId.value !== null) {
      result.inputs[PowerBindingInputAction.Forwards] = this.commonFormMapperService.mapInputFormToSchemeInput(
        form.controls.inputs.controls[PowerBindingInputAction.Forwards] as InputFormGroup,
      );
    }
    if (form.controls.inputs.controls[PowerBindingInputAction.Backwards].controls.controllerId.value !== null) {
      result.inputs[PowerBindingInputAction.Backwards] = this.commonFormMapperService.mapInputFormToSchemeInput(
        form.controls.inputs.controls[PowerBindingInputAction.Backwards] as InputFormGroup,
      );
    }
    return result;
  }
}
