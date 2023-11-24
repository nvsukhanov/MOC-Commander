import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeInputAction, ControlSchemeServoBinding } from '@app/store';

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
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            throw new Error('Hub ID and port ID must be set');
        }
        return {
            id,
            bindingType: ControlSchemeBindingType.Servo,
            ...form.getRawValue(),
            hubId,
            portId,
            inputs: {
                [ControlSchemeInputAction.Servo]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[ControlSchemeInputAction.Servo]
                )
            }
        };
    }
}
