import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MOTOR_LIMITS, MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { BindingStepperOutputState } from '@app/store';

import { StepperOutputConfigurationForm } from '../binding-output';

@Injectable({ providedIn: 'root' })
export class StepperOutputControlFormBuilderService {
    private readonly defaultStepDegree = 90;

    constructor(
        private readonly formBuilder: FormBuilder
    ) {
    }

    public build(
        initialConfiguration?: BindingStepperOutputState['stepperConfig']
    ): StepperOutputConfigurationForm {
        return this.formBuilder.group({
            degree: this.formBuilder.control<number>(initialConfiguration?.degree ?? this.defaultStepDegree, { nonNullable: true }),
            power: this.formBuilder.control<number>(initialConfiguration?.power ?? MOTOR_LIMITS.maxPower, { nonNullable: true }),
            speed: this.formBuilder.control<number>(initialConfiguration?.speed ?? MOTOR_LIMITS.maxSpeed, { nonNullable: true }),
            endState: this.formBuilder.control<MotorServoEndState>(initialConfiguration?.endState ?? MotorServoEndState.hold, { nonNullable: true })
        });
    }
}
