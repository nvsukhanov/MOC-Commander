import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ControlSchemeBindingType, DeepPartial } from '@app/shared';
import { ControlSchemeBinding } from '@app/store';

import { ControlSchemeBindingForm } from '../types';
import { ServoBindingFormBuilderService } from './servo-binding-form-builder.service';
import { SetSpeedBindingFormBuilderService } from './set-speed-binding-form-builder.service';
import { SetAngleBindingFormBuilderService } from './set-angle-binding-form-builder.service';
import { StepperBindingFormBuilderService } from './stepper-binding-form-builder.service';
import { TrainControlBindingFormBuilderService } from './train-control-binding-form-builder.service';
import { GearboxControlBindingFormBuilderService } from './gearbox-control-binding-form-builder.service';
import { ControlSchemeValidators } from '../../validation';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly servoBindingFormBuilder: ServoBindingFormBuilderService,
        private readonly setSpeedBindingFormBuilder: SetSpeedBindingFormBuilderService,
        private readonly setAngleBindingFormBuilder: SetAngleBindingFormBuilderService,
        private readonly stepperBindingFormBuilder: StepperBindingFormBuilderService,
        private readonly trainControlBindingFormBuilder: TrainControlBindingFormBuilderService,
        private readonly gearboxControlBindingFormBuilder: GearboxControlBindingFormBuilderService,
    ) {
    }

    public createBindingForm(): ControlSchemeBindingForm {
        return this.formBuilder.group({
            id: this.formBuilder.control<number>(0, {
                nonNullable: true,
                validators: [
                    Validators.required
                ]
            }),
            bindingType: this.formBuilder.control<ControlSchemeBindingType>(
                ControlSchemeBindingType.SetSpeed,
                {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        ControlSchemeValidators.isInEnum(ControlSchemeBindingType)
                    ]
                }
            ),
            [ControlSchemeBindingType.SetSpeed]: this.setSpeedBindingFormBuilder.build(),
            [ControlSchemeBindingType.Servo]: this.servoBindingFormBuilder.build(),
            [ControlSchemeBindingType.SetAngle]: this.setAngleBindingFormBuilder.build(),
            [ControlSchemeBindingType.Stepper]: this.stepperBindingFormBuilder.build(),
            [ControlSchemeBindingType.TrainControl]: this.trainControlBindingFormBuilder.build(),
            [ControlSchemeBindingType.GearboxControl]: this.gearboxControlBindingFormBuilder.build()
        });
    }

    public patchForm(
        form: ControlSchemeBindingForm,
        patch: DeepPartial<ControlSchemeBinding>
    ): void {
        if (patch.bindingType !== undefined) {
            form.controls.bindingType.setValue(patch.bindingType);
        }
        if (patch.id !== undefined) {
            form.controls.id.setValue(patch.id);
        }
        switch (patch.bindingType) {
            case ControlSchemeBindingType.SetSpeed:
                this.setSpeedBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.SetSpeed], patch);
                break;
            case ControlSchemeBindingType.Servo:
                this.servoBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.Servo], patch);
                break;
            case ControlSchemeBindingType.SetAngle:
                this.setAngleBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.SetAngle], patch);
                break;
            case ControlSchemeBindingType.Stepper:
                this.stepperBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.Stepper], patch);
                break;
            case ControlSchemeBindingType.TrainControl:
                this.trainControlBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.TrainControl], patch);
                break;
            case ControlSchemeBindingType.GearboxControl:
                this.gearboxControlBindingFormBuilder.patchForm(form.controls[ControlSchemeBindingType.GearboxControl], patch);
                break;
            default:
                return patch.bindingType satisfies void;
        }
    }
}
