import { Injectable } from '@angular/core';
import { BindingLinearOutputState, BindingOutputState, BindingServoOutputState, GamepadInputMethod, HubIoOperationMode } from '../../../store';
import { ControlSchemeBindingOutputForm, LinearOutputConfiguration, ServoOutputConfiguration } from '../binding-output';
import { FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MOTOR_LIMITS } from '../../../lego-hub';
import { BindingForm, EditSchemeForm } from '../types';
import { ControlSchemeBindingInputForm } from '../binding-input';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormFactoryService {
    constructor(
        private readonly formBuilder: FormBuilder,
    ) {
    }

    public createEditSchemeForm(
        id: string,
        name: string
    ): EditSchemeForm {
        return this.formBuilder.group({
            id: this.formBuilder.control<string>(id, [ Validators.required ]) as FormControl<string>,
            name: this.formBuilder.control<string>(name, [ Validators.required ]) as FormControl<string>,
            bindings: this.formBuilder.array<BindingForm>([], Validators.required)
        });
    }

    public createBindingForm(
        id: string,
        gamepadId: number,
        inputMethod: GamepadInputMethod,
        gamepadAxisId: number | null = null,
        gamepadButtonId: number | null = null,
        hubId: string,
        portId: number,
        operationMode: HubIoOperationMode,
        initialState?: BindingOutputState
    ): BindingForm {
        const inputControl: ControlSchemeBindingInputForm = this.formBuilder.group({
            gamepadId: this.formBuilder.control(gamepadId, { nonNullable: true, validators: [ Validators.required ] }),
            gamepadInputMethod: this.formBuilder.control(inputMethod, { nonNullable: true, validators: [ Validators.required ] }),
            gamepadAxisId: this.formBuilder.control(gamepadAxisId ?? null),
            gamepadButtonId: this.formBuilder.control(gamepadButtonId ?? null),
        });

        const outputFrom: ControlSchemeBindingOutputForm = this.createOutputControlForm(
            hubId,
            portId,
            operationMode,
            initialState
        );

        return this.formBuilder.group({
            id: this.formBuilder.control(id, { nonNullable: true }),
            input: inputControl,
            output: outputFrom
        }) as BindingForm;
    }

    private createOutputControlForm(
        hubId: string,
        portId: number,
        operationMode: HubIoOperationMode,
        outputState?: BindingOutputState
    ): ControlSchemeBindingOutputForm {
        return this.formBuilder.group({
            hubId: this.formBuilder.control(hubId, { nonNullable: true, validators: [ Validators.required ] }),
            portId: this.formBuilder.control(portId, { nonNullable: true, validators: [ Validators.required ] }),
            operationMode: this.formBuilder.control<HubIoOperationMode>(operationMode, { nonNullable: true, validators: [ Validators.required ] }),
            linearConfig: this.buildLinearOutputControlForm(
                hubId,
                portId,
                outputState?.operationMode === HubIoOperationMode.Linear ? outputState.linearConfig : undefined
            ),
            servoConfig: this.buildServoOutputControlForm(
                hubId,
                portId,
                outputState?.operationMode === HubIoOperationMode.Servo ? outputState.servoConfig : undefined
            )
        });
    }

    private buildServoOutputControlForm(
        hubId: string,
        portId: number,
        initialConfiguration?: BindingServoOutputState['servoConfig']
    ): ServoOutputConfiguration {
        return this.formBuilder.group({
            minAngle: this.formBuilder.control<number>(initialConfiguration?.minAngle ?? -MOTOR_LIMITS.maxServoDegreesRange / 2, {
                nonNullable: true,
                validators: [
                    Validators.required,
                ]
            }),
            maxAngle: this.formBuilder.control<number>(initialConfiguration?.maxAngle ?? MOTOR_LIMITS.maxServoDegreesRange / 2, {
                nonNullable: true,
                validators: [
                    Validators.required,
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
        }, {
            validators: [ this.validateServoConfiguration as ValidatorFn ]
        });
    }

    private validateServoConfiguration(
        form: ServoOutputConfiguration
    ): ValidationErrors | null {
        const errors: ValidationErrors = {};
        let hasErrors = false;
        if (form.controls.minAngle.value > form.controls.maxAngle.value) {
            errors['overlapping'] = true;
            hasErrors = true;
        }

        if (Math.abs(form.controls.minAngle.value - form.controls.maxAngle.value) < MOTOR_LIMITS.minServoDegreesRange) {
            errors['belowMinimumRange'] = true;
            hasErrors = true;
        }

        if (Math.abs(form.controls.minAngle.value - form.controls.maxAngle.value) > MOTOR_LIMITS.maxServoDegreesRange) {
            errors['aboveMaximumRange'] = true;
            hasErrors = true;
        }
        if (hasErrors) {
            return errors;
        }
        return null;
    }

    private buildLinearOutputControlForm(
        hubId: string,
        portId: number,
        initialConfiguration?: BindingLinearOutputState['linearConfig']
    ): LinearOutputConfiguration {
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
