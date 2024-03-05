import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeTrainControlBinding, TrainControlInputAction } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { TrainControlBindingForm } from './train-control-binding-form';

@Injectable()
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
                [TrainControlInputAction.NextSpeed]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[TrainControlInputAction.NextSpeed]
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
        if (form.controls.inputs.controls[TrainControlInputAction.Reset].controls.controllerId.value !== null) {
            result.inputs[TrainControlInputAction.Reset] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[TrainControlInputAction.Reset] as InputFormGroup);
        }
        if (form.controls.inputs.controls[TrainControlInputAction.PrevSpeed].controls.controllerId.value !== null) {
            result.inputs[TrainControlInputAction.PrevSpeed] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[TrainControlInputAction.PrevSpeed] as InputFormGroup);
        }
        return result;
    }
}
