import { Injectable } from '@angular/core';
import { AttachedIO, HubIoOperationMode } from '../../../store';
import { ControlSchemeBindingOutputControl, ControlSchemeBindingOutputLinearControl } from '../binding-output';
import { FormBuilder, Validators } from '@angular/forms';
import { MotorFeature } from '../../../lego-hub';

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
                speed: this.formBuilder.control(MotorFeature.maxSpeed, {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.min(0),
                        Validators.max(MotorFeature.maxSpeed)
                    ]
                }),
                isToggle: this.formBuilder.control(false, { nonNullable: true }),
                invert: this.formBuilder.control(false, { nonNullable: true }),
                power: this.formBuilder.control(MotorFeature.maxPower, {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.min(0),
                        Validators.max(MotorFeature.maxPower)
                    ]
                })
            })
        });
    }
}
