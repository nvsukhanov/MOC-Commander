import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeSetAngleBinding, SetAngleBindingInputAction } from '@app/store';

import { CommonFormMapperService } from '../common';
import { SetAngleBindingForm } from './set-angle-binding-form';

@Injectable()
export class SetAngleBindingFormMapperService {
  constructor(private readonly commonFormMapperService: CommonFormMapperService) {}

  public mapToModel(id: ControlSchemeBinding['id'], form: SetAngleBindingForm): ControlSchemeSetAngleBinding {
    const hubId = form.controls.hubId.value;
    const portId = form.controls.portId.value;
    if (hubId === null || portId === null) {
      throw new Error('Hub ID and port ID must be set');
    }
    return {
      id,
      bindingType: ControlSchemeBindingType.SetAngle,
      ...form.getRawValue(),
      hubId,
      portId,
      inputs: {
        [SetAngleBindingInputAction.SetAngle]: this.commonFormMapperService.mapInputFormToSchemeInput(
          form.controls.inputs.controls[SetAngleBindingInputAction.SetAngle],
        ),
      },
    };
  }
}
