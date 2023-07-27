import { Inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ControlSchemeBinding, ControlSchemePortConfig } from '@app/store';
import { APP_CONFIG, HubIoOperationMode, IAppConfig, WINDOW } from '@app/shared';
import { TranslocoService } from '@ngneat/transloco';

import { ControlSchemeBindingForm, ControlSchemeEditForm, ControlSchemePortConfigForm } from '../../types';
import { ServoOutputControlFormBuilderService } from './servo-output-control-form-builder.service';
import { LinearOutputControlFormBuilderService } from './linear-output-control-form-builder.service';
import { SetAngleOutputControlFormBuilderService } from './set-angle-output-control-form-builder.service';
import { StepperOutputControlFormBuilderService } from './stepper-output-control-form-builder.service';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly translocoService: TranslocoService,
        @Inject(WINDOW) private readonly window: Window,
        private readonly servoOutputControlFormBuilder: ServoOutputControlFormBuilderService,
        private readonly linearOutputControlFormBuilder: LinearOutputControlFormBuilderService,
        private readonly setAngleOutputControlFormBuilder: SetAngleOutputControlFormBuilderService,
        private readonly stepperOutputControlFormBuilder: StepperOutputControlFormBuilderService,
        @Inject(APP_CONFIG) private readonly config: IAppConfig,
    ) {
    }

    public createEditSchemeForm(): ControlSchemeEditForm {
        return this.formBuilder.group({
            id: this.formBuilder.control<string>(this.window.crypto.randomUUID(), { nonNullable: true, validators: [ Validators.required ] }),
            name: this.formBuilder.control<string>(
                this.translocoService.translate('controlScheme.newSchemeDefaultName'),
                { nonNullable: true, validators: [ Validators.required ] }
            ),
            portConfigs: this.formBuilder.array<ControlSchemePortConfigForm>([]),
            bindings: this.formBuilder.array<ControlSchemeBindingForm>([], Validators.required),
        });
    }

    public createPortConfigForm(
        initialState?: ControlSchemePortConfig
    ): ControlSchemePortConfigForm {
        return this.formBuilder.group({
            hubId: this.formBuilder.control<string>(
                initialState?.hubId ?? '',
                { nonNullable: true, validators: [ Validators.required ] }
            ),
            portId: this.formBuilder.control<number>(
                initialState?.portId ?? 0,
                { nonNullable: true, validators: [ Validators.required ] }
            ),
            useAccelerationProfile: this.formBuilder.control<boolean>(
                initialState?.useAccelerationProfile ?? false,
                { nonNullable: true }
            ),
            accelerationTimeMs: this.formBuilder.control<number>(
                initialState?.accelerationTimeMs ?? this.config.defaultAccelerationTimeMs,
                { nonNullable: true }
            ),
            useDecelerationProfile: this.formBuilder.control<boolean>(
                initialState?.useDecelerationProfile ?? false,
                { nonNullable: true }
            ),
            decelerationTimeMs: this.formBuilder.control<number>(
                initialState?.decelerationTimeMs ?? this.config.defaultDecelerationTimeMs,
                { nonNullable: true }
            ),
        });
    }

    public createBindingForm(
        initialState?: ControlSchemeBinding
    ): ControlSchemeBindingForm {
        const form: ControlSchemeBindingForm = this.formBuilder.group({
            bindingFormOperationMode: this.formBuilder.control<HubIoOperationMode>(HubIoOperationMode.Linear, { nonNullable: true }),
            [HubIoOperationMode.Linear]: this.linearOutputControlFormBuilder.build(),
            [HubIoOperationMode.Servo]: this.servoOutputControlFormBuilder.build(),
            [HubIoOperationMode.SetAngle]: this.setAngleOutputControlFormBuilder.build(),
            [HubIoOperationMode.Stepper]: this.stepperOutputControlFormBuilder.build(),
        });
        if (initialState) {
            form.controls.bindingFormOperationMode.setValue(initialState.operationMode);
            switch (initialState.operationMode) {
                case HubIoOperationMode.Linear:
                    form.get(HubIoOperationMode.Linear)?.patchValue(initialState);
                    break;
                case HubIoOperationMode.Servo:
                    form.get(HubIoOperationMode.Servo)?.patchValue(initialState);
                    break;
                case HubIoOperationMode.SetAngle:
                    form.get(HubIoOperationMode.SetAngle)?.patchValue(initialState);
                    break;
                case HubIoOperationMode.Stepper:
                    form.get(HubIoOperationMode.Stepper)?.patchValue(initialState);
            }
        }
        return form;
    }
}
