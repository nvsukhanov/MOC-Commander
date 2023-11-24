import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeInputAction, ControlSchemeStepperBinding } from '@app/store';

import { StepperBindingForm } from '../types';
import { CommonFormMapperService } from './common-form-mapper.service';

@Injectable({ providedIn: 'root' })
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
        return {
            id,
            bindingType: ControlSchemeBindingType.Stepper,
            ...form.getRawValue(),
            hubId,
            portId,
            inputs: {
                [ControlSchemeInputAction.Step]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[ControlSchemeInputAction.Step]
                )
            }
        };
    }
}
