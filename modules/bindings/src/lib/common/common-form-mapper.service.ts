import { Injectable } from '@angular/core';
import { ControlSchemeInput, InputGain } from '@app/store';

import { InputFormGroup } from './input-form-group';
import { isInputGainApplicable } from './is-input-gain-applicable';

@Injectable({ providedIn: 'root' })
export class CommonFormMapperService {
    public mapInputFormToSchemeInput(
        form: InputFormGroup
    ): ControlSchemeInput {
        const formValue = form.getRawValue();
        const gain = isInputGainApplicable(formValue.inputType) ? formValue.gain : InputGain.Linear;
        const result: ControlSchemeInput = {
            controllerId: formValue.controllerId,
            inputId: formValue.inputId,
            inputType: formValue.inputType,
            gain,
            inputDirection: formValue.inputDirection
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
