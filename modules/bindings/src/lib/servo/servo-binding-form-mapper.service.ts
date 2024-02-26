import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeInputAction, ControlSchemeServoBinding } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { ServoBindingForm } from './servo-binding-form';

@Injectable()
export class ServoBindingFormMapperService {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: ServoBindingForm
    ): ControlSchemeServoBinding {
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            throw new Error('Hub ID and port ID must be set');
        }
        const result: ControlSchemeServoBinding = {
            id,
            bindingType: ControlSchemeBindingType.Servo,
            ...form.getRawValue(),
            hubId,
            portId,
            inputs: {
            }
        };
        if (form.controls.inputs.controls[ControlSchemeInputAction.ServoCw].controls.controllerId.value !== null) {
            result.inputs[ControlSchemeInputAction.ServoCw] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[ControlSchemeInputAction.ServoCw] as InputFormGroup);
        }
        if (form.controls.inputs.controls[ControlSchemeInputAction.ServoCcw].controls.controllerId.value !== null) {
            result.inputs[ControlSchemeInputAction.ServoCcw] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[ControlSchemeInputAction.ServoCcw] as InputFormGroup);
        }
        return result;
    }
}
