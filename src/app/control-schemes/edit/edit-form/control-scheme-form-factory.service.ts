import { Injectable } from '@angular/core';
import { BindingLinearOutput, BindingOutput, GamepadInputMethod, HubIoOperationMode } from '../../../store';
import { ControlSchemeBindingOutputControl, ControlSchemeBindingOutputLinearControl, LinearOutputConfigurationForm } from '../binding-output';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MOTOR_LIMITS } from '../../../lego-hub';
import { BindingForm, EditSchemeForm } from '../types';
import { ControlSchemeBindingInputControl } from '../binding-input';

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
        configuration?: BindingOutput['configuration']
    ): BindingForm {
        const inputControl: ControlSchemeBindingInputControl = this.formBuilder.group({
            gamepadId: this.formBuilder.control(gamepadId, { nonNullable: true, validators: [ Validators.required ] }),
            gamepadInputMethod: this.formBuilder.control(inputMethod, { nonNullable: true, validators: [ Validators.required ] }),
            gamepadAxisId: this.formBuilder.control(gamepadAxisId ?? null),
            gamepadButtonId: this.formBuilder.control(gamepadButtonId ?? null),
        });

        return this.formBuilder.group({
            id: this.formBuilder.control(id, { nonNullable: true }),
            input: inputControl,
            output: this.createOutputControlForm(hubId, portId, operationMode, configuration)
        });
    }

    private createOutputControlForm(
        hubId: string,
        portId: number,
        operationMode: HubIoOperationMode,
        configuration?: BindingOutput['configuration']
    ): ControlSchemeBindingOutputControl {
        switch (operationMode) {
            case HubIoOperationMode.Linear:
                return this.buildLinearOutputControlForm(hubId, portId, operationMode, configuration);
            default:
                throw new Error(`Unsupported operation mode: ${operationMode}`);
        }
    }

    private buildLinearOutputControlForm(
        hubId: string,
        portId: number,
        operationMode: HubIoOperationMode,
        initialConfiguration?: BindingLinearOutput['configuration']
    ): ControlSchemeBindingOutputLinearControl {
        const configuration: LinearOutputConfigurationForm = this.formBuilder.group({
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

        return this.formBuilder.group({
            hubId: this.formBuilder.control(hubId, { nonNullable: true, validators: [ Validators.required ] }),
            portId: this.formBuilder.control(portId, { nonNullable: true, validators: [ Validators.required ] }),
            operationMode: this.formBuilder.control(operationMode, { nonNullable: true, validators: [ Validators.required ] }),
            configuration
        });
    }
}
