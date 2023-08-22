import { Injectable } from '@angular/core';
import { ControlSchemeServoBinding } from '@app/store';
import { HubIoOperationMode } from '@app/shared';

import { ServoBindingForm } from '../types';

@Injectable({ providedIn: 'root' })
export class ServoBindingFormMapperService {
    public mapToModel(
        form: ServoBindingForm
    ): ControlSchemeServoBinding {
        return {
            operationMode: HubIoOperationMode.Servo,
            ...form.getRawValue()
        };
    }
}
