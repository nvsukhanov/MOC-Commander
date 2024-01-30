import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ButtonGroupButtonId, MOTOR_LIMITS, MotorServoEndState } from 'rxpoweredup';
import { ControllerInputType } from '@app/controller-profiles';
import { AppValidators } from '@app/shared-misc';
import { ControlSchemeInput, InputGain, LoopingMode } from '@app/store';

import { InputFormGroup, OptionalInputFormGroup } from './input-form-group';

@Injectable({ providedIn: 'root' })
export class CommonBindingsFormControlsBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
    ) {
    }

    public speedControl(
        initialValue: number = MOTOR_LIMITS.maxSpeed
    ): FormControl<number> {
        return this.formBuilder.control<number>(initialValue, {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.min(0),
                Validators.max(MOTOR_LIMITS.maxSpeed),
                AppValidators.requireInteger
            ]
        });
    }

    public speedLevelControl(
        initialValue: number = MOTOR_LIMITS.maxSpeed
    ): FormControl<number> {
        return this.formBuilder.control<number>(initialValue, {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.min(MOTOR_LIMITS.minSpeed),
                Validators.max(MOTOR_LIMITS.maxSpeed),
                AppValidators.requireInteger
            ]
        });
    }

    public powerControl(): FormControl<number> {
        return this.formBuilder.control<number>(MOTOR_LIMITS.maxPower, {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.min(MOTOR_LIMITS.minPower),
                Validators.max(MOTOR_LIMITS.maxPower),
                AppValidators.requireInteger
            ]
        });
    }

    public toggleControl(
        initialValue: boolean = false
    ): FormControl<boolean> {
        return this.formBuilder.control<boolean>(initialValue, {
            nonNullable: true,
            validators: [ AppValidators.requireBoolean ]
        });
    }

    public angleControl(
        initialValue: number = 0
    ): FormControl<number> {
        return this.formBuilder.control<number>(initialValue, {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.min(-MOTOR_LIMITS.maxServoDegreesRange / 2),
                Validators.max(MOTOR_LIMITS.maxServoDegreesRange / 2),
                AppValidators.requireInteger
            ]
        });
    }

    public servoEndStateControl(
        initialValue: MotorServoEndState = MotorServoEndState.float
    ): FormControl<MotorServoEndState> {
        return this.formBuilder.control<MotorServoEndState>(initialValue, {
            nonNullable: true,
            validators: [ Validators.required, AppValidators.isInEnum(MotorServoEndState) ]
        });
    }

    public loopingModeControl(
        initialValue: LoopingMode = LoopingMode.None
    ): FormControl<LoopingMode> {
        return this.formBuilder.control<LoopingMode>(initialValue, {
            nonNullable: true,
            validators: [ Validators.required, AppValidators.isInEnum(LoopingMode) ]
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
                validators: [ Validators.required, AppValidators.isInEnum(ControllerInputType) ]
            }),
            inputId: this.formBuilder.control<string>(initialValue?.inputId ?? '', {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            gain: this.formBuilder.control<InputGain>(initialValue?.gain ?? InputGain.None, {
                nonNullable: true,
                validators: [ Validators.required, AppValidators.isInEnum(InputGain) ]
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
