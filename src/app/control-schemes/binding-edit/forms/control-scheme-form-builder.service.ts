import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HubIoOperationMode } from '@app/shared';

import { ControlSchemeBindingForm } from '../types';
import { ServoBindingFormBuilderService } from './servo-binding-form-builder.service';
import { LinearBindingFormBuilderService } from './linear-binding-form-builder.service';
import { SetAngleBindingFormBuilderService } from './set-angle-binding-form-builder.service';
import { StepperBindingFormBuilderService } from './stepper-binding-form-builder.service';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly servoOutputControlFormBuilder: ServoBindingFormBuilderService,
        private readonly linearOutputControlFormBuilder: LinearBindingFormBuilderService,
        private readonly setAngleOutputControlFormBuilder: SetAngleBindingFormBuilderService,
        private readonly stepperOutputControlFormBuilder: StepperBindingFormBuilderService,
    ) {
    }

    public createBindingForm(): ControlSchemeBindingForm {
        return this.formBuilder.group({
            bindingFormOperationMode: this.formBuilder.control<HubIoOperationMode>(HubIoOperationMode.Linear, { nonNullable: true }),
            [HubIoOperationMode.Linear]: this.linearOutputControlFormBuilder.build(),
            [HubIoOperationMode.Servo]: this.servoOutputControlFormBuilder.build(),
            [HubIoOperationMode.SetAngle]: this.setAngleOutputControlFormBuilder.build(),
            [HubIoOperationMode.Stepper]: this.stepperOutputControlFormBuilder.build(),
        });

    }
}
