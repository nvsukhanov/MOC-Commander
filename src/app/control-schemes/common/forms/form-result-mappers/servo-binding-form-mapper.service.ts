import { Injectable } from '@angular/core';
import { ControlSchemeBinding, ControlSchemeInputAction, ControlSchemeServoBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { ServoBindingForm } from '../types';
import { CommonFormMapperService } from './common-form-mapper.service';

@Injectable({ providedIn: 'root' })
export class ServoBindingFormMapperService {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: ServoBindingForm
    ): ControlSchemeServoBinding {
        return {
            id,
            operationMode: ControlSchemeBindingType.Servo,
            ...form.getRawValue(),
            inputs: {
                [ControlSchemeInputAction.Servo]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[ControlSchemeInputAction.Servo]
                )
            }
        };
    }
}
