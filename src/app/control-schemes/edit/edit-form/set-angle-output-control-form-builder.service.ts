import { Injectable } from '@angular/core';
import { BindingSetAngleOutputState } from '../../../store';
import { SetAngleOutputConfigurationForm } from '../binding-output';
import { FormBuilder } from '@angular/forms';
import { MOTOR_LIMITS, MotorServoEndState } from '@nvsukhanov/rxpoweredup';

@Injectable({ providedIn: 'root' })
export class SetAngleOutputControlFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder
    ) {
    }

    public build(
        initialConfiguration?: BindingSetAngleOutputState['setAngleConfig']
    ): SetAngleOutputConfigurationForm {
        return this.formBuilder.group({
            angle: this.formBuilder.control<number>(initialConfiguration?.angle ?? 0, { nonNullable: true }),
            speed: this.formBuilder.control<number>(initialConfiguration?.speed ?? MOTOR_LIMITS.maxSpeed, { nonNullable: true }),
            power: this.formBuilder.control<number>(initialConfiguration?.power ?? MOTOR_LIMITS.maxPower, { nonNullable: true }),
            endState: this.formBuilder.control<MotorServoEndState>(initialConfiguration?.endState ?? MotorServoEndState.float, { nonNullable: true })
        });
    }
}
