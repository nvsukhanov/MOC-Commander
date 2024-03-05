import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeStepperBinding, StepperInputAction } from '@app/store';

import { CommonFormMapperService, InputFormGroup } from '../common';
import { StepperBindingForm } from './stepper-binding-form';

@Injectable()
export class StepperBindingFormMapperService {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: StepperBindingForm
    ): ControlSchemeStepperBinding {

        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            throw new Error('Hub ID and port ID must be set');
        }
        const result: ControlSchemeStepperBinding = {
            id,
            bindingType: ControlSchemeBindingType.Stepper,
            ...form.getRawValue(),
            hubId,
            portId,
            inputs: {}
        };

        if (form.controls.inputs.controls[StepperInputAction.Cw].controls.controllerId.value !== null) {
            result.inputs[StepperInputAction.Cw] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[StepperInputAction.Cw] as InputFormGroup);
        }
        if (form.controls.inputs.controls[StepperInputAction.Ccw].controls.controllerId.value !== null) {
            result.inputs[StepperInputAction.Ccw] =
                this.commonFormMapperService.mapInputFormToSchemeInput(form.controls.inputs.controls[StepperInputAction.Ccw] as InputFormGroup);
        }
        return result;
    }
}
