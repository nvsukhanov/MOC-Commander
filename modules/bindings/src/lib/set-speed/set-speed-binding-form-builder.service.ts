import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DeepPartial } from '@app/shared-misc';
import { ControlSchemeInputAction, ControlSchemeSetSpeedBinding } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

import { CommonBindingsFormControlsBuilderService } from '../common';
import { IFormBuilder } from '../i-form-builder';
import { SetSpeedBindingForm } from './set-speed-binding-form';

@Injectable()
export class SetSpeedBindingFormBuilderService implements IFormBuilder<SetSpeedBindingForm> {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonBindingsFormControlsBuilderService,
        private readonly controlSchemeFormBuilder: ControlSchemeFormBuilderService
    ) {
    }

    public build(): SetSpeedBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [ControlSchemeInputAction.Accelerate]: this.commonFormControlBuilder.inputFormGroup(),
                [ControlSchemeInputAction.Brake]: this.commonFormControlBuilder.optionalInputFormGroup(),
            }),
            hubId: this.controlSchemeFormBuilder.hubIdControl(),
            portId: this.controlSchemeFormBuilder.portIdControl(),
            maxSpeed: this.commonFormControlBuilder.speedControl(),
            invert: this.commonFormControlBuilder.toggleControl(),
            power: this.commonFormControlBuilder.powerControl(),
            useAccelerationProfile: this.commonFormControlBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlBuilder.toggleControl()
        });
    }

    public patchForm(
        form: SetSpeedBindingForm,
        patch: DeepPartial<ControlSchemeSetSpeedBinding>
    ): void {
        form.patchValue(patch);
    }
}
