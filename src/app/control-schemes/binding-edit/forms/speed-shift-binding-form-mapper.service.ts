import { Injectable } from '@angular/core';
import { ControlSchemeInput, ControlSchemeSpeedShiftBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { SpeedShiftBindingForm } from '../types';

@Injectable({ providedIn: 'root' })
export class SpeedShiftBindingFormMapperService {
    public mapToModel(
        form: SpeedShiftBindingForm
    ): ControlSchemeSpeedShiftBinding {
        const result: ControlSchemeSpeedShiftBinding = {
            id: form.controls.id.getRawValue(),
            operationMode: ControlSchemeBindingType.SpeedShift,
            inputs: {
                nextSpeed: form.controls.inputs.controls.nextSpeed.getRawValue(),
            },
            hubId: form.controls.hubId.getRawValue(),
            portId: form.controls.portId.getRawValue(),
            levels: form.controls.levels.getRawValue(),
            power: form.controls.power.getRawValue(),
            useAccelerationProfile: form.controls.useAccelerationProfile.getRawValue(),
            useDecelerationProfile: form.controls.useDecelerationProfile.getRawValue(),
            initialStepIndex: form.controls.initialStepIndex.getRawValue()
        };
        if (form.controls.inputs.controls.stop.controls.controllerId.value !== '') {
            result.inputs.stop = form.controls.inputs.controls.stop.getRawValue() as ControlSchemeInput;
        }
        if (form.controls.inputs.controls.prevSpeed.controls.controllerId.value !== '') {
            result.inputs.prevSpeed = form.controls.inputs.controls.prevSpeed.getRawValue() as ControlSchemeInput;
        }
        return result;
    }
}
