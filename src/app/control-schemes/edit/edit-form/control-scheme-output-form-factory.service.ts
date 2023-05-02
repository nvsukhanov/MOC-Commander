import { Injectable } from '@angular/core';
import { AttachedIO, HubIoOperationMode } from '../../../store';
import { ControlSchemeBindingOutputControl, ControlSchemeBindingOutputLinearControl } from '../binding-output';
import { FormBuilder, Validators } from '@angular/forms';
import { MOTOR_LIMITS } from '../../../lego-hub';

@Injectable({ providedIn: 'root' })
export class ControlSchemeOutputFormFactoryService {
    constructor(
        private readonly formBuilder: FormBuilder,
    ) {
    }

    public create(
        io: AttachedIO,
        operationMode: HubIoOperationMode,
    ): ControlSchemeBindingOutputControl {
        switch (operationMode) {
            case HubIoOperationMode.Linear:
                return this.buildOutputControlFrom(io, operationMode);
            default:
                throw new Error(`Unsupported operation mode: ${operationMode}`);
        }
    }

    private buildOutputControlFrom(
        io: AttachedIO,
        operationMode: HubIoOperationMode,
    ): ControlSchemeBindingOutputLinearControl {
        return this.formBuilder.group({
            hubId: this.formBuilder.control(io.hubId, { nonNullable: true, validators: [ Validators.required ] }),
            portId: this.formBuilder.control(io.portId, { nonNullable: true, validators: [ Validators.required ] }),
            operationMode: this.formBuilder.control(operationMode, { nonNullable: true, validators: [ Validators.required ] }),
            configuration: this.formBuilder.group({
                maxSpeed: this.formBuilder.control(MOTOR_LIMITS.maxAbsSpeed, {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.min(0),
                        Validators.max(MOTOR_LIMITS.maxAbsSpeed)
                    ]
                }),
                isToggle: this.formBuilder.control(false, { nonNullable: true }),
                invert: this.formBuilder.control(false, { nonNullable: true }),
                power: this.formBuilder.control(MOTOR_LIMITS.maxPower, {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.min(MOTOR_LIMITS.minPower),
                        Validators.max(MOTOR_LIMITS.maxPower)
                    ]
                })
            })
        });
    }
}
