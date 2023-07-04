import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';

import { ControlSchemeBindingOutputForm, StepperOutputConfigurationForm } from '../../binding-output';
import { IOutputConfigurationRenderer } from '../i-output-configuration-renderer';
import { OutputConfigSliderControlComponent, OutputEndStateSelectorComponent, OutputNumInputControlComponent } from '../controls';

@Component({
    standalone: true,
    selector: 'app-stepper-output-configuration-edit',
    templateUrl: './stepper-output-configuration-edit.component.html',
    styleUrls: [ './stepper-output-configuration-edit.component.scss' ],
    imports: [
        NgIf,
        OutputConfigSliderControlComponent,
        OutputNumInputControlComponent,
        OutputEndStateSelectorComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepperOutputConfigurationEditComponent implements IOutputConfigurationRenderer {
    public readonly minStepperDegree = -MOTOR_LIMITS.maxServoDegreesRange;

    public readonly maxStepperDegree = MOTOR_LIMITS.maxServoDegreesRange;

    public readonly minSpeed = 0;

    public readonly maxSpeed = MOTOR_LIMITS.maxSpeed;

    public readonly minPower = MOTOR_LIMITS.minPower;

    public readonly maxPower = MOTOR_LIMITS.maxPower;

    private _form?: StepperOutputConfigurationForm;

    constructor(
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    public get form(): StepperOutputConfigurationForm | undefined {
        return this._form;
    }

    public setOutputFormControl(
        outputFormControl: ControlSchemeBindingOutputForm
    ): void {
        if (outputFormControl.controls.stepperConfig !== this._form) {
            this._form = outputFormControl.controls.stepperConfig;
            this.cdRef.detectChanges();
        }
    }
}
