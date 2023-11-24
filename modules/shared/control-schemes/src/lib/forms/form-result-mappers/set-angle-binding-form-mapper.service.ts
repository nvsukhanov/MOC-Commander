import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeInputAction, ControlSchemeSetAngleBinding } from '@app/store';

import { SetAngleBindingForm } from '../types';
import { CommonFormMapperService } from './common-form-mapper.service';

@Injectable({ providedIn: 'root' })
export class SetAngleBindingFormMapperService {
    constructor(
        private readonly commonFormMapperService: CommonFormMapperService
    ) {
    }

    public mapToModel(
        id: ControlSchemeBinding['id'],
        form: SetAngleBindingForm
    ): ControlSchemeSetAngleBinding {
        const hubId = form.controls.hubId.value;
        const portId = form.controls.portId.value;
        if (hubId === null || portId === null) {
            throw new Error('Hub ID and port ID must be set');
        }
        return {
            id,
            bindingType: ControlSchemeBindingType.SetAngle,
            ...form.getRawValue(),
            hubId,
            portId,
            inputs: {
                [ControlSchemeInputAction.SetAngle]: this.commonFormMapperService.mapInputFormToSchemeInput(
                    form.controls.inputs.controls[ControlSchemeInputAction.SetAngle]
                )
            }
        };
    }
}
