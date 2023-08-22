import { Injectable } from '@angular/core';
import { ControlSchemeSetAngleBinding } from '@app/store';
import { HubIoOperationMode } from '@app/shared';

import { SetAngleBindingForm } from '../types';

@Injectable({ providedIn: 'root' })
export class SetAngleFormMapperService {
    public mapToModel(
        form: SetAngleBindingForm
    ): ControlSchemeSetAngleBinding {
        return {
            operationMode: HubIoOperationMode.SetAngle,
            ...form.getRawValue()
        };
    }
}
