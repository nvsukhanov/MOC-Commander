import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeSpeedBinding, SpeedInputAction } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { IBindingFormMapper } from '../i-binding-form-mapper';
import { SpeedBindingForm } from './speed-binding-form';

@Injectable()
export class SpeedBindingFormMapperService implements IBindingFormMapper<SpeedBindingForm, ControlSchemeSpeedBinding> {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: SpeedBindingForm
    ): ControlSchemeSpeedBinding {
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            throw new Error('Hub ID and port ID must be set');
        }
        const result: ControlSchemeSpeedBinding = {
            id,
            bindingType: ControlSchemeBindingType.Speed,
            inputs: {},
            hubId,
            portId,
            maxSpeed: form.controls.maxSpeed.getRawValue(),
            invert: form.controls.invert.getRawValue(),
            power: form.controls.power.getRawValue(),
            useAccelerationProfile: form.controls.useAccelerationProfile.getRawValue(),
            useDecelerationProfile: form.controls.useDecelerationProfile.getRawValue(),
        };
        if (form.controls.inputs.controls[SpeedInputAction.Forwards].controls.controllerId.value !== null) {
            result.inputs[SpeedInputAction.Forwards] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[SpeedInputAction.Forwards] as InputFormGroup);
        }
        if (form.controls.inputs.controls[SpeedInputAction.Backwards].controls.controllerId.value !== null) {
            result.inputs[SpeedInputAction.Backwards] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[SpeedInputAction.Backwards] as InputFormGroup);
        }
        if (form.controls.inputs.controls[SpeedInputAction.Brake].controls.controllerId.value !== null) {
            result.inputs[SpeedInputAction.Brake] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[SpeedInputAction.Brake] as InputFormGroup);
        }
        return result;
    }
}
