import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeSetSpeedBinding, SetSpeedInputAction } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { IBindingFormMapper } from '../i-binding-form-mapper';
import { SetSpeedBindingForm } from './set-speed-binding-form';

@Injectable()
export class SetSpeedBindingFormMapperService implements IBindingFormMapper<SetSpeedBindingForm, ControlSchemeSetSpeedBinding> {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: SetSpeedBindingForm
    ): ControlSchemeSetSpeedBinding {
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            throw new Error('Hub ID and port ID must be set');
        }
        const result: ControlSchemeSetSpeedBinding = {
            id,
            bindingType: ControlSchemeBindingType.SetSpeed,
            inputs: {},
            hubId,
            portId,
            maxSpeed: form.controls.maxSpeed.getRawValue(),
            invert: form.controls.invert.getRawValue(),
            power: form.controls.power.getRawValue(),
            useAccelerationProfile: form.controls.useAccelerationProfile.getRawValue(),
            useDecelerationProfile: form.controls.useDecelerationProfile.getRawValue(),
        };
        if (form.controls.inputs.controls[SetSpeedInputAction.Forwards].controls.controllerId.value !== null) {
            result.inputs[SetSpeedInputAction.Forwards] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[SetSpeedInputAction.Forwards] as InputFormGroup);
        }
        if (form.controls.inputs.controls[SetSpeedInputAction.Backwards].controls.controllerId.value !== null) {
            result.inputs[SetSpeedInputAction.Backwards] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[SetSpeedInputAction.Backwards] as InputFormGroup);
        }
        if (form.controls.inputs.controls[SetSpeedInputAction.Brake].controls.controllerId.value !== null) {
            result.inputs[SetSpeedInputAction.Brake] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[SetSpeedInputAction.Brake] as InputFormGroup);
        }
        return result;
    }
}
