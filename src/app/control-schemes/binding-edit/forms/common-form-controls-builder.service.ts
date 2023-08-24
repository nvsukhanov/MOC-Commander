import { Inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ButtonGroupButtonId, MOTOR_LIMITS, MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { ControllerInputType, WINDOW } from '@app/shared';
import { ControlSchemeInput, InputGain } from '@app/store';

import { InputFormGroup, OptionalInputFormGroup } from '../types';

@Injectable({ providedIn: 'root' })
export class CommonFormControlsBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        @Inject(WINDOW) private readonly window: Window,
    ) {
    }

    public schemeIdControl(): FormControl<string> {
        return this.formBuilder.control<string>(this.window.crypto.randomUUID(), { nonNullable: true });
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

    public speedSelectControl(
        initialValue: number = MOTOR_LIMITS.maxSpeed
    ): FormControl<number> {
        return this.formBuilder.control<number>(initialValue, {
            nonNullable: true,
            validators: [ Validators.required, Validators.min(MOTOR_LIMITS.minSpeed), Validators.max(MOTOR_LIMITS.maxSpeed) ]
        });
    }

    public angleSelectControl(
        initialValue: number = 0
    ): FormControl<number> {
        return this.formBuilder.control<number>(initialValue, {
            nonNullable: true,
            validators: [ Validators.required, Validators.min(MOTOR_LIMITS.minRawAngle), Validators.max(MOTOR_LIMITS.maxRawAngle) ]
        });
    }

    public servoEndStateControl(
        initialValue: MotorServoEndState = MotorServoEndState.float
    ): FormControl<MotorServoEndState> {
        return this.formBuilder.control<MotorServoEndState>(initialValue, {
            nonNullable: true,
            validators: [ Validators.required ]
        });
    }

    public inputFormGroup(
        initialValue?: Partial<ControlSchemeInput>
    ): InputFormGroup {
        return this.formBuilder.group({
            controllerId: this.formBuilder.control<string>(initialValue?.controllerId ?? '', {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            inputType: this.formBuilder.control<ControllerInputType>(initialValue?.inputType ?? ControllerInputType.Button, {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            inputId: this.formBuilder.control<string>(initialValue?.inputId ?? '', {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            gain: this.formBuilder.control<InputGain>(initialValue?.gain ?? InputGain.None, {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            buttonId: this.formBuilder.control<ButtonGroupButtonId | null>(initialValue?.portId ?? null),
            portId: this.formBuilder.control<number | null>(initialValue?.portId ?? null)
        });
    }

    public optionalInputFormGroup(
        initialValue?: Partial<ControlSchemeInput>
    ): OptionalInputFormGroup {
        return this.formBuilder.group({
            controllerId: this.formBuilder.control<string | null>(initialValue?.controllerId ?? null),
            inputType: this.formBuilder.control<ControllerInputType>(initialValue?.inputType ?? ControllerInputType.Button, {
                nonNullable: true
            }),
            inputId: this.formBuilder.control<string>(initialValue?.inputId ?? '', {
                nonNullable: true
            }),
            gain: this.formBuilder.control<InputGain>(initialValue?.gain ?? InputGain.None, {
                nonNullable: true
            }),
            buttonId: this.formBuilder.control<ButtonGroupButtonId | null>(initialValue?.portId ?? null),
            portId: this.formBuilder.control<number | null>(initialValue?.portId ?? null)
        });
    }
}
