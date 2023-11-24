import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding } from '@app/store';

import { ControlSchemeBindingForm } from '../types';
import { SetSpeedBindingFormMapperService } from './set-speed-binding-form-mapper.service';
import { ServoBindingFormMapperService } from './servo-binding-form-mapper.service';
import { SetAngleBindingFormMapperService } from './set-angle-binding-form-mapper.service';
import { StepperBindingFormMapperService } from './stepper-binding-form-mapper.service';
import { TrainControlBindingFormMapperService } from './train-control-binding-form-mapper.service';
import { GearboxControlBindingFormMapperService } from './gearbox-control-binding-form-mapper.service';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormMapperService {
    constructor(
        private readonly setSpeedBindingMapper: SetSpeedBindingFormMapperService,
        private readonly servoBindingMapper: ServoBindingFormMapperService,
        private readonly setAngleBindingMapper: SetAngleBindingFormMapperService,
        private readonly stepperBindingMapper: StepperBindingFormMapperService,
        private readonly trainControlBindingMapper: TrainControlBindingFormMapperService,
        private readonly gearboxControlBindingMapper: GearboxControlBindingFormMapperService
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
            case ControlSchemeBindingType.TrainControl:
                return this.trainControlBindingMapper.mapToModel(id, form.controls[ControlSchemeBindingType.TrainControl]);
            case ControlSchemeBindingType.GearboxControl:
                return this.gearboxControlBindingMapper.mapToModel(id, form.controls[ControlSchemeBindingType.GearboxControl]);
        }
    }
}
