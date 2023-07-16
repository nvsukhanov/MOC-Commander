import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BindingOutputState } from '@app/store';
import { ControllerInputType, HubIoOperationMode } from '@app/shared';

import { ControlSchemeBindingOutputForm } from '../binding-output';
import { BindingForm, EditSchemeForm } from '../types';
import { ControlSchemeBindingInputForm } from '../binding-input';
import { ServoOutputControlFormBuilderService } from './servo-output-control-form-builder.service';
import { LinearOutputControlFormBuilderService } from './linear-output-control-form-builder.service';
import { SetAngleOutputControlFormBuilderService } from './set-angle-output-control-form-builder.service';
import { StepperOutputControlFormBuilderService } from './stepper-output-control-form-builder.service';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly servoOutputControlFormBuilder: ServoOutputControlFormBuilderService,
        private readonly linearOutputControlFormBuilder: LinearOutputControlFormBuilderService,
        private readonly setAngleOutputControlFormBuilder: SetAngleOutputControlFormBuilderService,
        private readonly stepperOutputControlFormBuilder: StepperOutputControlFormBuilderService,
    ) {
    }

    public createEditSchemeForm(
        id: string,
        name: string
    ): EditSchemeForm {
        return this.formBuilder.group({
            id: this.formBuilder.control<string>(id, { nonNullable: true, validators: [ Validators.required ] }),
            name: this.formBuilder.control<string>(name, { nonNullable: true, validators: [ Validators.required ] }),
            bindings: this.formBuilder.array<BindingForm>([], Validators.required),
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
            linearConfig: this.linearOutputControlFormBuilder.build(
                outputState?.operationMode === HubIoOperationMode.Linear ? outputState.linearConfig : undefined
            ),
            servoConfig: this.servoOutputControlFormBuilder.build(
                outputState?.operationMode === HubIoOperationMode.Servo ? outputState.servoConfig : undefined
            ),
            setAngleConfig: this.setAngleOutputControlFormBuilder.build(
                outputState?.operationMode === HubIoOperationMode.SetAngle ? outputState.setAngleConfig : undefined
            ),
            stepperConfig: this.stepperOutputControlFormBuilder.build(
                outputState?.operationMode === HubIoOperationMode.Stepper ? outputState.stepperConfig : undefined
            ),
        });
    }
}
