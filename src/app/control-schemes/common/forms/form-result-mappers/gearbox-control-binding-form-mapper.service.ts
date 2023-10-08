import { Injectable } from '@angular/core';
import { ControlSchemeBinding, ControlSchemeGearboxControlBinding, ControlSchemeInputAction } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { GearboxControlBindingForm, InputFormGroup } from '../types';
import { CommonFormMapperService } from './common-form-mapper.service';

@Injectable({ providedIn: 'root' })
export class GearboxControlBindingFormMapperService {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: GearboxControlBindingForm
    ): ControlSchemeGearboxControlBinding {
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            throw new Error('Hub ID and port ID must be set');
        }
        const result: ControlSchemeGearboxControlBinding = {
            id,
            bindingType: ControlSchemeBindingType.GearboxControl,
            inputs: {
                [ControlSchemeInputAction.NextLevel]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[ControlSchemeInputAction.NextLevel]
                )
            },
            hubId,
            portId,
            angles: form.controls.angles.getRawValue(),
            speed: form.controls.speed.getRawValue(),
            power: form.controls.power.getRawValue(),
            loopingMode: form.controls.loopingMode.getRawValue(),
            endState: form.controls.endState.getRawValue(),
            useAccelerationProfile: form.controls.useAccelerationProfile.getRawValue(),
            useDecelerationProfile: form.controls.useDecelerationProfile.getRawValue(),
            initialLevelIndex: form.controls.initialLevelIndex.getRawValue()
        };
        if (form.controls.inputs.controls[ControlSchemeInputAction.PrevLevel].controls.controllerId.value !== null) {
            result.inputs[ControlSchemeInputAction.PrevLevel] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[ControlSchemeInputAction.PrevLevel] as InputFormGroup);
        }
        if (form.controls.inputs.controls[ControlSchemeInputAction.Reset].controls.controllerId.value !== null) {
            result.inputs[ControlSchemeInputAction.Reset] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[ControlSchemeInputAction.Reset] as InputFormGroup);
        }
        return result;
    }
}
