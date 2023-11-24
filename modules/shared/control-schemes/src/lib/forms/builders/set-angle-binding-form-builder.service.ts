import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MotorServoEndState } from 'rxpoweredup';
import { DeepPartial } from '@app/shared-misc';
import { ControlSchemeInputAction, ControlSchemeSetAngleBinding } from '@app/store';

import { SetAngleBindingForm } from '../types';
import { CommonFormControlsBuilderService } from './common-form-controls-builder.service';

@Injectable({ providedIn: 'root' })
export class SetAngleBindingFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public build(): SetAngleBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [ControlSchemeInputAction.SetAngle]: this.commonFormControlBuilder.inputFormGroup()
            }),
            hubId: this.commonFormControlBuilder.hubIdControl(),
            portId: this.commonFormControlBuilder.portIdControl(),
            angle: this.commonFormControlBuilder.angleControl(),
            speed: this.commonFormControlBuilder.speedControl(),
            power: this.commonFormControlBuilder.powerControl(),
            endState: this.commonFormControlBuilder.servoEndStateControl(MotorServoEndState.hold),
            useAccelerationProfile: this.commonFormControlBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlBuilder.toggleControl()
        });
    }

    public patchForm(
        form: SetAngleBindingForm,
        patch: DeepPartial<ControlSchemeSetAngleBinding>
    ): void {
        form.patchValue(patch);
    }
}
