import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeTrainBinding, TrainBindingInputAction } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { TrainBindingForm } from './train-binding-form';

@Injectable()
export class TrainBindingFormMapperService {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: TrainBindingForm
    ): ControlSchemeTrainBinding {
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            throw new Error('Hub ID and port ID must be set');
        }
        const result: ControlSchemeTrainBinding = {
            id,
            bindingType: ControlSchemeBindingType.Train,
            inputs: {
                [TrainBindingInputAction.NextSpeed]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[TrainBindingInputAction.NextSpeed]
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
        if (form.controls.inputs.controls[TrainBindingInputAction.Reset].controls.controllerId.value !== null) {
            result.inputs[TrainBindingInputAction.Reset]
                = this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[TrainBindingInputAction.Reset] as InputFormGroup);
        }
        if (form.controls.inputs.controls[TrainBindingInputAction.PrevSpeed].controls.controllerId.value !== null) {
            result.inputs[TrainBindingInputAction.PrevSpeed]
                = this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[TrainBindingInputAction.PrevSpeed] as InputFormGroup);
        }
        return result;
    }
}
