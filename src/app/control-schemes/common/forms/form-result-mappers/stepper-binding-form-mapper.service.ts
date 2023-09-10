import { Injectable } from '@angular/core';
import { ControlSchemeBinding, ControlSchemeInputAction, ControlSchemeStepperBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

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
        return {
            id,
            bindingType: ControlSchemeBindingType.Stepper,
            ...form.getRawValue(),
            inputs: {
                [ControlSchemeInputAction.Step]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[ControlSchemeInputAction.Step]
                )
            }
        };
    }
}
