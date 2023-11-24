import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeInputAction, ControlSchemeSetSpeedBinding } from '@app/store';

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
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            throw new Error('Hub ID and port ID must be set');
        }
        const result: ControlSchemeSetSpeedBinding = {
            id,
            bindingType: ControlSchemeBindingType.SetSpeed,
            inputs: {
                [ControlSchemeInputAction.Accelerate]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[ControlSchemeInputAction.Accelerate]
                )
            },
            hubId,
            portId,
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
