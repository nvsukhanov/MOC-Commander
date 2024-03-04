import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeInputAction, ControlSchemeSetSpeedBinding } from '@app/store';

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
        if (form.controls.inputs.controls[ControlSchemeInputAction.Forwards].controls.controllerId.value !== null) {
            result.inputs[ControlSchemeInputAction.Forwards] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[ControlSchemeInputAction.Forwards] as InputFormGroup);
        }
        if (form.controls.inputs.controls[ControlSchemeInputAction.Backwards].controls.controllerId.value !== null) {
            result.inputs[ControlSchemeInputAction.Backwards] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[ControlSchemeInputAction.Backwards] as InputFormGroup);
        }
        if (form.controls.inputs.controls[ControlSchemeInputAction.Brake].controls.controllerId.value !== null) {
            result.inputs[ControlSchemeInputAction.Brake] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[ControlSchemeInputAction.Brake] as InputFormGroup);
        }
        return result;
    }
}
