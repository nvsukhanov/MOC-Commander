import { Inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ControllerInputType, WINDOW } from '@app/shared';
import { MOTOR_LIMITS, MotorServoEndState } from '@nvsukhanov/rxpoweredup';

@Injectable({ providedIn: 'root' })
export class CommonFormControlsBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        @Inject(WINDOW) private readonly window: Window
    ) {
    }

    public schemeIdControl(): FormControl<string> {
        return this.formBuilder.control<string>(this.window.crypto.randomUUID(), { nonNullable: true });
    }

    public controllerIdControl(): FormControl<string> {
        return this.formBuilder.control<string>('', {
            nonNullable: true,
            validators: [ Validators.required ]
        });
    }

    public inputIdControl(): FormControl<string> {
        return this.formBuilder.control<string>('', {
            nonNullable: true,
            validators: [ Validators.required ]
        });
    }

    public hubIdControl(): FormControl<string> {
        return this.formBuilder.control<string>('', {
            nonNullable: true,
            validators: [ Validators.required ]
        });
    }

    public portIdControl(): FormControl<number> {
        return this.formBuilder.control<number>(-1, {
            nonNullable: true,
            validators: [ Validators.required, Validators.min(0) ]
        });
    }

    public speedControl(): FormControl<number> {
        return this.formBuilder.control<number>(MOTOR_LIMITS.maxSpeed, {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.min(0),
                Validators.max(MOTOR_LIMITS.maxSpeed)
            ]
        });
    }

    public powerControl(): FormControl<number> {
        return this.formBuilder.control<number>(MOTOR_LIMITS.maxPower, {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.min(MOTOR_LIMITS.minPower),
                Validators.max(MOTOR_LIMITS.maxPower)
            ]
        });
    }

    public toggleControl(
        initialValue: boolean = false
    ): FormControl<boolean> {
        return this.formBuilder.control<boolean>(initialValue, { nonNullable: true });
    }

    public servoEndStateControl(
        initialValue: MotorServoEndState = MotorServoEndState.float
    ): FormControl<MotorServoEndState> {
        return this.formBuilder.control<MotorServoEndState>(initialValue, {
            nonNullable: true,
            validators: [ Validators.required ]
        });
    }

    public controllerInputTypeControl(
        initialValue: ControllerInputType
    ): FormControl<ControllerInputType> {
        return this.formBuilder.control<ControllerInputType>(initialValue, {
            nonNullable: true,
            validators: [ Validators.required ]
        });
    }
}
