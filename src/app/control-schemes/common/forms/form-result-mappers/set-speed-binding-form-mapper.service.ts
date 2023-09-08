import { Injectable } from '@angular/core';
import { ControlSchemeBinding, ControlSchemeInputAction, ControlSchemeSetSpeedBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { InputFormGroup, SetSpeedBindingForm } from '../types';
import { CommonFormMapperService } from './common-form-mapper.service';

@Injectable({ providedIn: 'root' })
export class SetSpeedBindingFormMapperService {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: SetSpeedBindingForm
    ): ControlSchemeSetSpeedBinding {
        const result: ControlSchemeSetSpeedBinding = {
            id,
            operationMode: ControlSchemeBindingType.SetSpeed,
            inputs: {
                [ControlSchemeInputAction.Accelerate]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[ControlSchemeInputAction.Accelerate]
                )
            },
            hubId: form.controls.hubId.getRawValue(),
            portId: form.controls.portId.getRawValue(),
            maxSpeed: form.controls.maxSpeed.getRawValue(),
            invert: form.controls.invert.getRawValue(),
            power: form.controls.power.getRawValue(),
            useAccelerationProfile: form.controls.useAccelerationProfile.getRawValue(),
            useDecelerationProfile: form.controls.useDecelerationProfile.getRawValue(),
        };
        if (form.controls.inputs.controls[ControlSchemeInputAction.Brake].controls.controllerId.value !== null) {
            result.inputs[ControlSchemeInputAction.Brake] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[ControlSchemeInputAction.Brake] as InputFormGroup);
        }
        return result;
    }
}
