import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeGearboxBinding, GearboxInputAction } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { GearboxBindingForm } from './gearbox-binding-form';

@Injectable()
export class GearboxBindingFormMapperService {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: GearboxBindingForm
    ): ControlSchemeGearboxBinding {
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            throw new Error('Hub ID and port ID must be set');
        }
        const result: ControlSchemeGearboxBinding = {
            id,
            bindingType: ControlSchemeBindingType.Gearbox,
            inputs: {
                [GearboxInputAction.NextGear]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[GearboxInputAction.NextGear]
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
        if (form.controls.inputs.controls[GearboxInputAction.PrevGear].controls.controllerId.value !== null) {
            result.inputs[GearboxInputAction.PrevGear] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[GearboxInputAction.PrevGear] as InputFormGroup);
        }
        if (form.controls.inputs.controls[GearboxInputAction.Reset].controls.controllerId.value !== null) {
            result.inputs[GearboxInputAction.Reset] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[GearboxInputAction.Reset] as InputFormGroup);
        }
        return result;
    }
}
