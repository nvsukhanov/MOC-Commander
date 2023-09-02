import { Injectable } from '@angular/core';
import { ControlSchemeInput } from '@app/store';

import { InputFormGroup } from '../types';

@Injectable({ providedIn: 'root' })
export class CommonFormMapperService {
    public mapInputFormToSchemeInput(
        form: InputFormGroup
    ): ControlSchemeInput {
        const formValue = form.getRawValue();
        const result: ControlSchemeInput = {
            controllerId: formValue.controllerId,
            inputId: formValue.inputId,
            inputType: formValue.inputType,
            gain: formValue.gain,
        };
        if (formValue.portId !== null) {
            result.portId = formValue.portId;
        }
        if (formValue.buttonId !== null) {
            result.buttonId = formValue.buttonId;
        }
        return result;
    }
}
