import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppValidators } from '@app/shared-misc';
import { DEFAULT_ACC_DEC_PROFILE_TIME_MS } from '@app/store';

import { PortConfigEditForm } from './port-config-edit-form';
import { ControlSchemeFormBuilderService } from './control-scheme-form-builder.service';

@Injectable({ providedIn: 'root' })
export class PortConfigFormBuilderService {
    public static readonly minAccDecProfileTimeMs = 0;

    public static readonly maxAccDecProfileTimeMs = 10000;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly commonFormControlBuilder: ControlSchemeFormBuilderService
    ) {
    }

    public build(): PortConfigEditForm {
        return this.formBuilder.group({
            hubId: this.commonFormControlBuilder.hubIdControl(),
            portId: this.commonFormControlBuilder.portIdControl(),
            accelerationTimeMs: this.formBuilder.control<number>(
                DEFAULT_ACC_DEC_PROFILE_TIME_MS,
                {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.min(PortConfigFormBuilderService.minAccDecProfileTimeMs),
                        Validators.max(PortConfigFormBuilderService.maxAccDecProfileTimeMs),
                        AppValidators.requireInteger
                    ]
                }
            ),
            decelerationTimeMs: this.formBuilder.control<number>(
                DEFAULT_ACC_DEC_PROFILE_TIME_MS,
                {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.min(PortConfigFormBuilderService.minAccDecProfileTimeMs),
                        Validators.max(PortConfigFormBuilderService.maxAccDecProfileTimeMs),
                        AppValidators.requireInteger
                    ]
                }
            )
        });
    }
}
