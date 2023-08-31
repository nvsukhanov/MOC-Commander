import { Injectable } from '@angular/core';
import { ControlSchemeInput, ControlSchemeInputAction, ControlSchemeSpeedShiftBinding } from '@app/store';
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
                [ControlSchemeInputAction.NextLevel]: form.controls.inputs.controls[ControlSchemeInputAction.NextLevel].getRawValue(),
            },
            hubId: form.controls.hubId.getRawValue(),
            portId: form.controls.portId.getRawValue(),
            levels: form.controls.levels.getRawValue(),
            power: form.controls.power.getRawValue(),
            loopingMode: form.controls.loopingMode.getRawValue(),
            useAccelerationProfile: form.controls.useAccelerationProfile.getRawValue(),
            useDecelerationProfile: form.controls.useDecelerationProfile.getRawValue(),
            initialStepIndex: form.controls.initialStepIndex.getRawValue()
        };
        if (form.controls.inputs.controls[ControlSchemeInputAction.Reset].controls.controllerId.value !== '') {
            result.inputs[ControlSchemeInputAction.Reset] = form.controls.inputs.controls[ControlSchemeInputAction.Reset].getRawValue() as ControlSchemeInput;
        }
        if (form.controls.inputs.controls[ControlSchemeInputAction.PrevLevel].controls.controllerId.value !== '') {
            result.inputs[ControlSchemeInputAction.PrevLevel] =
                form.controls.inputs.controls[ControlSchemeInputAction.PrevLevel].getRawValue() as ControlSchemeInput;
        }
        return result;
    }
}
