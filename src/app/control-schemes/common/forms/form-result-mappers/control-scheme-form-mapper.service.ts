import { Injectable } from '@angular/core';
import { ControlSchemeBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared';

import { ControlSchemeBindingForm } from '../types';
import { SetSpeedBindingFormMapperService } from './set-speed-binding-form-mapper.service';
import { ServoBindingFormMapperService } from './servo-binding-form-mapper.service';
import { SetAngleBindingFormMapperService } from './set-angle-binding-form-mapper.service';
import { StepperBindingFormMapperService } from './stepper-binding-form-mapper.service';
import { SpeedShiftBindingFormMapperService } from './speed-shift-binding-form-mapper.service';
import { AngleShiftBindingFormMapperService } from './angle-shift-binding-form-mapper.service';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormMapperService {
    constructor(
        private readonly setSpeedBindingMapper: SetSpeedBindingFormMapperService,
        private readonly servoBindingMapper: ServoBindingFormMapperService,
        private readonly setAngleBindingMapper: SetAngleBindingFormMapperService,
        private readonly stepperBindingMapper: StepperBindingFormMapperService,
        private readonly speedShiftBindingMapper: SpeedShiftBindingFormMapperService,
        private readonly angleShiftBindingMapper: AngleShiftBindingFormMapperService
    ) {
    }

    public mapToModel(
        form: ControlSchemeBindingForm
    ): ControlSchemeBinding {
        const operationMode = form.controls.bindingType.value;
        const id = form.controls.id.value;
        switch (operationMode) {
            case ControlSchemeBindingType.SetSpeed:
                return this.setSpeedBindingMapper.mapToModel(id, form.controls[ControlSchemeBindingType.SetSpeed]);
            case ControlSchemeBindingType.Servo:
                return this.servoBindingMapper.mapToModel(id, form.controls[ControlSchemeBindingType.Servo]);
            case ControlSchemeBindingType.SetAngle:
                return this.setAngleBindingMapper.mapToModel(id, form.controls[ControlSchemeBindingType.SetAngle]);
            case ControlSchemeBindingType.Stepper:
                return this.stepperBindingMapper.mapToModel(id, form.controls[ControlSchemeBindingType.Stepper]);
            case ControlSchemeBindingType.SpeedShift:
                return this.speedShiftBindingMapper.mapToModel(id, form.controls[ControlSchemeBindingType.SpeedShift]);
            case ControlSchemeBindingType.AngleShift:
                return this.angleShiftBindingMapper.mapToModel(id, form.controls[ControlSchemeBindingType.AngleShift]);
        }
    }
}
