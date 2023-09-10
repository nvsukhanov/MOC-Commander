import { Injectable } from '@angular/core';
import { ControlSchemeBinding, ControlSchemeInputAction, ControlSchemeSpeedShiftBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { InputFormGroup, SpeedShiftBindingForm } from '../types';
import { CommonFormMapperService } from './common-form-mapper.service';

@Injectable({ providedIn: 'root' })
export class SpeedShiftBindingFormMapperService {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: SpeedShiftBindingForm
    ): ControlSchemeSpeedShiftBinding {
        const result: ControlSchemeSpeedShiftBinding = {
            id,
            bindingType: ControlSchemeBindingType.SpeedShift,
            inputs: {
                [ControlSchemeInputAction.NextLevel]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[ControlSchemeInputAction.NextLevel]
                )
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
        if (form.controls.inputs.controls[ControlSchemeInputAction.Reset].controls.controllerId.value !== null) {
            result.inputs[ControlSchemeInputAction.Reset] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[ControlSchemeInputAction.Reset] as InputFormGroup);
        }
        if (form.controls.inputs.controls[ControlSchemeInputAction.PrevLevel].controls.controllerId.value !== null) {
            result.inputs[ControlSchemeInputAction.PrevLevel] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[ControlSchemeInputAction.PrevLevel] as InputFormGroup);
        }
        return result;
    }
}
