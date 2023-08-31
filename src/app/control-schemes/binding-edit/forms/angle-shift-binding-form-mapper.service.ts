import { Injectable } from '@angular/core';
import { ControlSchemeAngleShiftBinding, ControlSchemeInput, ControlSchemeInputAction } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { AngleShiftBindingForm } from '../types';

@Injectable({ providedIn: 'root' })
export class AngleShiftBindingFormMapperService {
    public mapToModel(
        form: AngleShiftBindingForm
    ): ControlSchemeAngleShiftBinding {
        const result: ControlSchemeAngleShiftBinding = {
            id: form.controls.id.getRawValue(),
            operationMode: ControlSchemeBindingType.AngleShift,
            inputs: {
                [ControlSchemeInputAction.NextLevel]: form.controls.inputs.controls[ControlSchemeInputAction.NextLevel].getRawValue(),
            },
            hubId: form.controls.hubId.getRawValue(),
            portId: form.controls.portId.getRawValue(),
            angles: form.controls.angles.getRawValue(),
            speed: form.controls.speed.getRawValue(),
            power: form.controls.power.getRawValue(),
            loopingMode: form.controls.loopingMode.getRawValue(),
            endState: form.controls.endState.getRawValue(),
            useAccelerationProfile: form.controls.useAccelerationProfile.getRawValue(),
            useDecelerationProfile: form.controls.useDecelerationProfile.getRawValue(),
            initialStepIndex: form.controls.initialStepIndex.getRawValue()
        };
        if (form.controls.inputs.controls[ControlSchemeInputAction.PrevLevel].controls.controllerId.value !== '') {
            result.inputs[ControlSchemeInputAction.PrevLevel] =
                form.controls.inputs.controls[ControlSchemeInputAction.PrevLevel].getRawValue() as ControlSchemeInput;
        }
        return result;
    }
}
