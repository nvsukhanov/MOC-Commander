import { Injectable } from '@angular/core';
import { ControlSchemeBinding } from '@app/store';
import { HubIoOperationMode } from '@app/shared';

import { ControlSchemeBindingForm } from '../types';
import { LinearBindingFormMapperService } from './linear-binding-form-mapper.service';
import { ServoBindingFormMapperService } from './servo-binding-form-mapper.service';
import { SetAngleFormMapperService } from './set-angle-form-mapper.service';
import { StepperBindingFormMapperService } from './stepper-binding-form-mapper.service';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormMapperService {
    constructor(
        private readonly linearBindingMapper: LinearBindingFormMapperService,
        private readonly servoBindingMapper: ServoBindingFormMapperService,
        private readonly setAngleBindingMapper: SetAngleFormMapperService,
        private readonly stepperBindingMapper: StepperBindingFormMapperService
    ) {
    }

    public mapToModel(
        form: ControlSchemeBindingForm
    ): ControlSchemeBinding {
        const operationMode = form.controls.bindingFormOperationMode.value;
        switch (operationMode) {
            case HubIoOperationMode.Linear:
                return this.linearBindingMapper.mapToModel(form.controls[HubIoOperationMode.Linear]);
            case HubIoOperationMode.Servo:
                return this.servoBindingMapper.mapToModel(form.controls[HubIoOperationMode.Servo]);
            case HubIoOperationMode.SetAngle:
                return this.setAngleBindingMapper.mapToModel(form.controls[HubIoOperationMode.SetAngle]);
            case HubIoOperationMode.Stepper:
                return this.stepperBindingMapper.mapToModel(form.controls[HubIoOperationMode.Stepper]);
        }
    }
}
