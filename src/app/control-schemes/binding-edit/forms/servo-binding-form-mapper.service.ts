import { Injectable } from '@angular/core';
import { ControlSchemeServoBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { ServoBindingForm } from '../types';

@Injectable({ providedIn: 'root' })
export class ServoBindingFormMapperService {
    public mapToModel(
        form: ServoBindingForm
    ): ControlSchemeServoBinding {
        return {
            operationMode: ControlSchemeBindingType.Servo,
            ...form.getRawValue()
        };
    }
}
