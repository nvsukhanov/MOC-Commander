import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeAccelerateBinding, ControlSchemeBinding, SpeedBindingInputAction } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { IBindingFormMapper } from '../i-binding-form-mapper';
import { AccelerateBindingForm } from './accelerate-binding-form';

@Injectable()
export class AccelerateBindingFormMapperService implements IBindingFormMapper<AccelerateBindingForm, ControlSchemeAccelerateBinding> {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: AccelerateBindingForm
    ): ControlSchemeAccelerateBinding {
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            throw new Error('Hub ID and port ID must be set');
        }
        const result: ControlSchemeAccelerateBinding = {
            id,
            bindingType: ControlSchemeBindingType.Accelerate,
            inputs: {},
            forwardsSpeedIncrement: form.controls.forwardsSpeedIncrement.getRawValue(),
            backwardsSpeedIncrement: form.controls.backwardsSpeedIncrement.getRawValue(),
            decelerateSpeedDecrement: form.controls.decelerateSpeedDecrement.getRawValue(),
            hubId,
            portId,
            maxSpeed: form.controls.maxSpeed.getRawValue(),
            invert: form.controls.invert.getRawValue(),
            power: form.controls.power.getRawValue(),
        };
        if (form.controls.inputs.controls[SpeedBindingInputAction.Forwards].controls.controllerId.value !== null) {
            result.inputs[SpeedBindingInputAction.Forwards] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[SpeedBindingInputAction.Forwards] as InputFormGroup);
        }
        if (form.controls.inputs.controls[SpeedBindingInputAction.Backwards].controls.controllerId.value !== null) {
            result.inputs[SpeedBindingInputAction.Backwards] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[SpeedBindingInputAction.Backwards] as InputFormGroup);
        }
        if (form.controls.inputs.controls[SpeedBindingInputAction.Brake].controls.controllerId.value !== null) {
            result.inputs[SpeedBindingInputAction.Brake] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[SpeedBindingInputAction.Brake] as InputFormGroup);
        }
        return result;
    }
}
