import { Injectable } from '@angular/core';
import { ControlSchemeInput, ControlSchemeInputAction, ControlSchemeSetSpeedBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { SetSpeedBindingForm } from '../types';

@Injectable({ providedIn: 'root' })
export class SetSpeedBindingFormMapperService {
    public mapToModel(
        form: SetSpeedBindingForm
    ): ControlSchemeSetSpeedBinding {
        const result: ControlSchemeSetSpeedBinding = {
            operationMode: ControlSchemeBindingType.SetSpeed,
            id: form.controls.id.getRawValue(),
            inputs: {
                [ControlSchemeInputAction.Accelerate]: form.controls.inputs.controls[ControlSchemeInputAction.Accelerate].getRawValue(),
            },
            hubId: form.controls.hubId.getRawValue(),
            portId: form.controls.portId.getRawValue(),
            maxSpeed: form.controls.maxSpeed.getRawValue(),
            isToggle: form.controls.isToggle.getRawValue(),
            invert: form.controls.invert.getRawValue(),
            power: form.controls.power.getRawValue(),
            useAccelerationProfile: form.controls.useAccelerationProfile.getRawValue(),
            useDecelerationProfile: form.controls.useDecelerationProfile.getRawValue(),
        };
        if (form.controls.inputs.controls[ControlSchemeInputAction.Brake].valid) {
            result.inputs[ControlSchemeInputAction.Brake] = form.controls.inputs.controls[ControlSchemeInputAction.Brake].getRawValue() as ControlSchemeInput;
        }
        return result;
    }
}
