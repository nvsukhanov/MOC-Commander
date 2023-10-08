import { Injectable } from '@angular/core';
import { ControlSchemeBinding, ControlSchemeInputAction, ControlSchemeTrainControlBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { InputFormGroup, TrainControlBindingForm } from '../types';
import { CommonFormMapperService } from './common-form-mapper.service';

@Injectable({ providedIn: 'root' })
export class TrainControlBindingFormMapperService {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: TrainControlBindingForm
    ): ControlSchemeTrainControlBinding {
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            throw new Error('Hub ID and port ID must be set');
        }
        const result: ControlSchemeTrainControlBinding = {
            id,
            bindingType: ControlSchemeBindingType.TrainControl,
            inputs: {
                [ControlSchemeInputAction.NextLevel]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[ControlSchemeInputAction.NextLevel]
                )
            },
            hubId,
            portId,
            levels: form.controls.levels.getRawValue(),
            power: form.controls.power.getRawValue(),
            loopingMode: form.controls.loopingMode.getRawValue(),
            useAccelerationProfile: form.controls.useAccelerationProfile.getRawValue(),
            useDecelerationProfile: form.controls.useDecelerationProfile.getRawValue(),
            initialLevelIndex: form.controls.initialLevelIndex.getRawValue()
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
