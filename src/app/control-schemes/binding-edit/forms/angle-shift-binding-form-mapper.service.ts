import { Injectable } from '@angular/core';
import { ControlSchemeAngleShiftBinding, ControlSchemeInput } from '@app/store';
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
                nextAngle: form.controls.inputs.controls.nextAngle.getRawValue(),
            },
            hubId: form.controls.hubId.getRawValue(),
            portId: form.controls.portId.getRawValue(),
            angles: form.controls.angles.getRawValue(),
            speed: form.controls.speed.getRawValue(),
            power: form.controls.power.getRawValue(),
            endState: form.controls.endState.getRawValue(),
            useAccelerationProfile: form.controls.useAccelerationProfile.getRawValue(),
            useDecelerationProfile: form.controls.useDecelerationProfile.getRawValue(),
            initialStepIndex: form.controls.initialStepIndex.getRawValue()
        };
        if (form.controls.inputs.controls.prevAngle.controls.controllerId.value !== '') {
            result.inputs.prevAngle = form.controls.inputs.controls.prevAngle.getRawValue() as ControlSchemeInput;
        }
        return result;
    }
}
