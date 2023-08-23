import { Injectable } from '@angular/core';
import { ControlSchemeStepperBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { StepperBindingForm } from '../types';

@Injectable({ providedIn: 'root' })
export class StepperBindingFormMapperService {
    public mapToModel(
        form: StepperBindingForm
    ): ControlSchemeStepperBinding {
        return {
            operationMode: ControlSchemeBindingType.Stepper,
            ...form.getRawValue()
        };
    }
}
