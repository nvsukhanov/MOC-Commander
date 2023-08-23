import { Injectable } from '@angular/core';
import { ControlSchemeBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { ControlSchemeBindingForm } from '../types';
import { LinearBindingFormMapperService } from './linear-binding-form-mapper.service';
import { ServoBindingFormMapperService } from './servo-binding-form-mapper.service';
import { SetAngleBindingFormMapperService } from './set-angle-binding-form-mapper.service';
import { StepperBindingFormMapperService } from './stepper-binding-form-mapper.service';
import { SpeedStepperBindingFormMapperService } from './speed-stepper-binding-form-mapper.service';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormMapperService {
    constructor(
        private readonly linearBindingMapper: LinearBindingFormMapperService,
        private readonly servoBindingMapper: ServoBindingFormMapperService,
        private readonly setAngleBindingMapper: SetAngleBindingFormMapperService,
        private readonly stepperBindingMapper: StepperBindingFormMapperService,
        private readonly speedStepperBindingMapper: SpeedStepperBindingFormMapperService,
    ) {
    }

    public mapToModel(
        form: ControlSchemeBindingForm
    ): ControlSchemeBinding {
        const operationMode = form.controls.bindingFormOperationMode.value;
        switch (operationMode) {
            case ControlSchemeBindingType.Linear:
                return this.linearBindingMapper.mapToModel(form.controls[ControlSchemeBindingType.Linear]);
            case ControlSchemeBindingType.Servo:
                return this.servoBindingMapper.mapToModel(form.controls[ControlSchemeBindingType.Servo]);
            case ControlSchemeBindingType.SetAngle:
                return this.setAngleBindingMapper.mapToModel(form.controls[ControlSchemeBindingType.SetAngle]);
            case ControlSchemeBindingType.Stepper:
                return this.stepperBindingMapper.mapToModel(form.controls[ControlSchemeBindingType.Stepper]);
            case ControlSchemeBindingType.SpeedStepper:
                return this.speedStepperBindingMapper.mapToModel(form.controls[ControlSchemeBindingType.SpeedStepper]);
        }
    }
}
