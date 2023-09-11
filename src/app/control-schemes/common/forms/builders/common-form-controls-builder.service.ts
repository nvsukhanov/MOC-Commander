import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ButtonGroupButtonId, MOTOR_LIMITS, MotorServoEndState } from 'rxpoweredup';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';
import { AppValidators, ControllerInputType } from '@app/shared';
import { ControlSchemeInput, InputGain, LoopingMode } from '@app/store';

import { InputFormGroup, OptionalInputFormGroup } from '../types';
import { ControlSchemeValidators } from '../../validation';

@Injectable({ providedIn: 'root' })
export class CommonFormControlsBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly translocoService: TranslocoService,
        private readonly store: Store
    ) {
    }

    public controlSchemeNameControl(
        requireUniqueName: boolean = true
    ): FormControl<string> {
        const asyncValidators: AsyncValidatorFn[] = [];
        if (requireUniqueName) {
            asyncValidators.push(ControlSchemeValidators.nameUniqueness(this.store));
        }
        return this.formBuilder.control<string>(this.translocoService.translate('controlScheme.newSchemeDialogDefaultName'), {
            nonNullable: true,
            validators: [
                Validators.required,
            ],
            asyncValidators
        });
    }

    public hubIdControl(): FormControl<string | null> {
        return this.formBuilder.control<string | null>(null, {
            nonNullable: false,
            validators: [ Validators.required ]
        });
    }

    public portIdControl(): FormControl<number | null> {
        return this.formBuilder.control<number | null>(null, {
            nonNullable: false,
            validators: [ Validators.required, Validators.min(0), Validators.max(0xFF) ]
        });
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
            validators: [ ControlSchemeValidators.requireBoolean ]
        });
    }

    public angleControl(
        initialValue: number = 0
    ): FormControl<number> {
        return this.formBuilder.control<number>(initialValue, {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.min(MOTOR_LIMITS.minRawAngle),
                Validators.max(MOTOR_LIMITS.maxRawAngle),
                AppValidators.requireInteger
            ]
        });
    }

    public servoEndStateControl(
        initialValue: MotorServoEndState = MotorServoEndState.float
    ): FormControl<MotorServoEndState> {
        return this.formBuilder.control<MotorServoEndState>(initialValue, {
            nonNullable: true,
            validators: [ Validators.required, ControlSchemeValidators.isInEnum(MotorServoEndState) ]
        });
    }

    public loopingModeControl(
        initialValue: LoopingMode = LoopingMode.None
    ): FormControl<LoopingMode> {
        return this.formBuilder.control<LoopingMode>(initialValue, {
            nonNullable: true,
            validators: [ Validators.required, ControlSchemeValidators.isInEnum(LoopingMode) ]
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
                validators: [ Validators.required, ControlSchemeValidators.isInEnum(ControllerInputType) ]
            }),
            inputId: this.formBuilder.control<string>(initialValue?.inputId ?? '', {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            gain: this.formBuilder.control<InputGain>(initialValue?.gain ?? InputGain.None, {
                nonNullable: true,
                validators: [ Validators.required, ControlSchemeValidators.isInEnum(InputGain) ]
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
