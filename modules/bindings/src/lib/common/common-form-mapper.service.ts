import { Injectable } from '@angular/core';
import { ControlSchemeInputConfig } from '@app/store';

import { InputFormGroup } from './input-form-group';

@Injectable({ providedIn: 'root' })
export class CommonFormMapperService {
  public mapInputFormToSchemeInput(form: InputFormGroup): ControlSchemeInputConfig {
    const formValue = form.getRawValue();
    const result: ControlSchemeInputConfig = {
      controllerId: formValue.controllerId,
      inputId: formValue.inputId,
      inputType: formValue.inputType,
      inputDirection: formValue.inputDirection,
      inputPipes: formValue.inputPipes,
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
