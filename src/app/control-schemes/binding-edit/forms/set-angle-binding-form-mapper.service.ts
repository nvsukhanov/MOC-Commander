import { Injectable } from '@angular/core';
import { ControlSchemeSetAngleBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { SetAngleBindingForm } from '../types';

@Injectable({ providedIn: 'root' })
export class SetAngleBindingFormMapperService {
    public mapToModel(
        form: SetAngleBindingForm
    ): ControlSchemeSetAngleBinding {
        return {
            operationMode: ControlSchemeBindingType.SetAngle,
            ...form.getRawValue()
        };
    }
}
