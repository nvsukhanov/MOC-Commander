import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeGearboxBinding, GearboxBindingInputAction } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { GearboxBindingForm } from './gearbox-binding-form';

@Injectable()
export class GearboxBindingFormMapperService {
  constructor(private readonly commonFormMapperService: CommonFormMapperService) {}

  public mapToModel(id: ControlSchemeBinding['id'], form: GearboxBindingForm): ControlSchemeGearboxBinding {
    const hubId = form.controls.hubId.value;
    const portId = form.controls.portId.value;
    if (hubId === null || portId === null) {
      throw new Error('Hub ID and port ID must be set');
    }
    const result: ControlSchemeGearboxBinding = {
      id,
      bindingType: ControlSchemeBindingType.Gearbox,
      inputs: {
        [GearboxBindingInputAction.NextGear]: this.commonFormMapperService.mapInputFormToSchemeInput(
          form.controls.inputs.controls[GearboxBindingInputAction.NextGear],
        ),
      },
      hubId,
      portId,
      angles: form.controls.angles.getRawValue(),
      speed: form.controls.speed.getRawValue(),
      power: form.controls.power.getRawValue(),
      loopingMode: form.controls.loopingMode.getRawValue(),
      endState: form.controls.endState.getRawValue(),
      useAccelerationProfile: form.controls.useAccelerationProfile.getRawValue(),
      useDecelerationProfile: form.controls.useDecelerationProfile.getRawValue(),
      initialLevelIndex: form.controls.initialLevelIndex.getRawValue(),
    };
    if (form.controls.inputs.controls[GearboxBindingInputAction.PrevGear].controls.controllerId.value !== null) {
      result.inputs[GearboxBindingInputAction.PrevGear] = this.commonFormMapperService.mapInputFormToSchemeInput(
        form.controls.inputs.controls[GearboxBindingInputAction.PrevGear] as InputFormGroup,
      );
    }
    if (form.controls.inputs.controls[GearboxBindingInputAction.Reset].controls.controllerId.value !== null) {
      result.inputs[GearboxBindingInputAction.Reset] = this.commonFormMapperService.mapInputFormToSchemeInput(
        form.controls.inputs.controls[GearboxBindingInputAction.Reset] as InputFormGroup,
      );
    }
    return result;
  }
}
