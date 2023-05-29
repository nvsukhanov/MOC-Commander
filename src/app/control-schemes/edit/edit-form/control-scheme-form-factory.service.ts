import { Injectable } from '@angular/core';
import { BindingLinearOutputState, BindingOutputState, BindingServoOutputState, ControllerInputType, HubIoOperationMode } from '../../../store';
import { ControlSchemeBindingOutputForm, LinearOutputConfiguration, ServoOutputConfiguration } from '../binding-output';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
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
        controllerId: string,
        inputId: string,
        inputType: ControllerInputType,
        hubId: string,
        portId: number,
        operationMode: HubIoOperationMode,
        initialState?: BindingOutputState
    ): BindingForm {
        const inputControl: ControlSchemeBindingInputForm = this.formBuilder.group({
            controllerId: this.formBuilder.control(controllerId, { nonNullable: true, validators: [ Validators.required ] }),
            inputId: this.formBuilder.control(inputId, { nonNullable: true, validators: [ Validators.required ] }),
            inputType: this.formBuilder.control<ControllerInputType>(inputType, { nonNullable: true, validators: [ Validators.required ] }),
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
                outputState?.operationMode === HubIoOperationMode.Linear ? outputState.linearConfig : undefined
            ),
            servoConfig: this.buildServoOutputControlForm(
                outputState?.operationMode === HubIoOperationMode.Servo ? outputState.servoConfig : undefined
            )
        });
    }

    private buildServoOutputControlForm(
        initialConfiguration?: BindingServoOutputState['servoConfig']
    ): ServoOutputConfiguration {
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
                    Validators.min(-MOTOR_LIMITS.maxServoDegreesRange), // TODO: min APOS value
                    Validators.max(MOTOR_LIMITS.maxServoDegreesRange), // TODO: max APOS value
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

    private buildLinearOutputControlForm(
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
