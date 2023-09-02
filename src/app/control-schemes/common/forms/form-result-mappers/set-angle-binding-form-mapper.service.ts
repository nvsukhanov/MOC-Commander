import { Injectable } from '@angular/core';
import { ControlSchemeInputAction, ControlSchemeSetAngleBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { SetAngleBindingForm } from '../types';
import { CommonFormMapperService } from './common-form-mapper.service';

@Injectable({ providedIn: 'root' })
export class SetAngleBindingFormMapperService {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        form: SetAngleBindingForm
    ): ControlSchemeSetAngleBinding {
        return {
            operationMode: ControlSchemeBindingType.SetAngle,
            ...form.getRawValue(),
            inputs: {
                [ControlSchemeInputAction.SetAngle]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[ControlSchemeInputAction.SetAngle]
                )
            }
        };
    }
}
