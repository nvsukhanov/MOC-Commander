import { Injectable } from '@angular/core';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { FormBuilder, Validators } from '@angular/forms';

import { BindingLinearOutputState } from '../../../store';
import { LinearOutputConfigurationForm } from '../binding-output';

@Injectable({ providedIn: 'root' })
export class LinearOutputControlFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder
    ) {
    }

    public build(
        initialConfiguration?: BindingLinearOutputState['linearConfig']
    ): LinearOutputConfigurationForm {
        return this.formBuilder.group({
            maxSpeed: this.formBuilder.control<number>(initialConfiguration?.maxSpeed ?? MOTOR_LIMITS.maxSpeed, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(MOTOR_LIMITS.maxSpeed)
                ]
            }),
            isToggle: this.formBuilder.control<boolean>(initialConfiguration?.isToggle ?? false, { nonNullable: true }),
            invert: this.formBuilder.control<boolean>(initialConfiguration?.invert ?? false, { nonNullable: true }),
            power: this.formBuilder.control<number>(initialConfiguration?.power ?? MOTOR_LIMITS.maxPower, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(MOTOR_LIMITS.minPower),
                    Validators.max(MOTOR_LIMITS.maxPower)
                ]
            })
        });
    }
}
