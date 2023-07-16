import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BindingServoOutputState } from '@app/store';

import { ServoOutputConfigurationForm } from '../binding-output';

@Injectable({ providedIn: 'root' })
export class ServoOutputControlFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder
    ) {
    }

    public build(
        initialConfiguration?: BindingServoOutputState['servoConfig']
    ): ServoOutputConfigurationForm {
        return this.formBuilder.group({
            range: this.formBuilder.control<number>(initialConfiguration?.range ?? MOTOR_LIMITS.maxServoDegreesRange, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(MOTOR_LIMITS.maxServoDegreesRange),
                ]
            }),
            aposCenter: this.formBuilder.control<number>(0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(-MOTOR_LIMITS.maxServoDegreesRange / 2),
                    Validators.max(MOTOR_LIMITS.maxServoDegreesRange / 2),
                ]
            }),
            speed: this.formBuilder.control<number>(initialConfiguration?.speed ?? MOTOR_LIMITS.maxSpeed, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(MOTOR_LIMITS.maxSpeed)
                ]
            }),
            power: this.formBuilder.control<number>(initialConfiguration?.power ?? MOTOR_LIMITS.maxPower, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(MOTOR_LIMITS.minPower),
                    Validators.max(MOTOR_LIMITS.maxPower)
                ]
            }),
            invert: this.formBuilder.control<boolean>(initialConfiguration?.invert ?? false, { nonNullable: true }),
        });
    }

}
