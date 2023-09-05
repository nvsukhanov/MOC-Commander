import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DEFAULT_ACC_DEC_PROFILE_TIME_MS } from '@app/store';

import { PortConfigEditForm } from '../types';
import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';
import { ControlSchemeValidators } from '../../validation';

@Injectable({ providedIn: 'root' })
export class PortConfigFormBuilderService {
    public static readonly minAccDecProfileTimeMs = 0;

    public static readonly maxAccDecProfileTimeMs = 10000;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly commonFormControlBuilder: CommonFormControlsBuilderService
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
                        ControlSchemeValidators.requireInteger
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
                        ControlSchemeValidators.requireInteger
                    ]
                }
            )
        });
    }
}
