import { Injectable } from '@angular/core';
import { ControlSchemeInput, ControlSchemeSpeedStepperBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { SpeedStepperBindingForm } from '../types';

@Injectable({ providedIn: 'root' })
export class SpeedStepperBindingFormMapperService {
    public mapToModel(
        form: SpeedStepperBindingForm
    ): ControlSchemeSpeedStepperBinding {
        const result: ControlSchemeSpeedStepperBinding = {
            id: form.controls.id.getRawValue(),
            operationMode: ControlSchemeBindingType.SpeedStepper,
            inputs: {
                nextSpeed: form.controls.inputs.controls.nextSpeed.getRawValue(),
            },
            hubId: form.controls.hubId.getRawValue(),
            portId: form.controls.portId.getRawValue(),
            steps: form.controls.steps.getRawValue(),
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
