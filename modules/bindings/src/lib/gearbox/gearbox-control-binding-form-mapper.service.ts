import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeGearboxControlBinding, GearboxControlInputAction } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { GearboxControlBindingForm } from './gearbox-binding-form';

@Injectable()
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
                [GearboxControlInputAction.NextGear]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[GearboxControlInputAction.NextGear]
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
        if (form.controls.inputs.controls[GearboxControlInputAction.PrevGear].controls.controllerId.value !== null) {
            result.inputs[GearboxControlInputAction.PrevGear] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[GearboxControlInputAction.PrevGear] as InputFormGroup);
        }
        if (form.controls.inputs.controls[GearboxControlInputAction.Reset].controls.controllerId.value !== null) {
            result.inputs[GearboxControlInputAction.Reset] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[GearboxControlInputAction.Reset] as InputFormGroup);
        }
        return result;
    }
}
