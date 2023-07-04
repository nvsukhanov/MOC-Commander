import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { MOTOR_LIMITS, MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { MatSliderModule } from '@angular/material/slider';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { ControlSchemeBindingOutputForm, StepperOutputConfigurationForm } from '../../binding-output';
import { IOutputConfigurationRenderer } from '../i-output-configuration-renderer';
import { MotorServoEndStateL10nKeyPipe } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-stepper-output-configuration-edit',
    templateUrl: './stepper-output-configuration-edit.component.html',
    styleUrls: [ './stepper-output-configuration-edit.component.scss' ],
    imports: [
        NgIf,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        TranslocoModule,
        MatSliderModule,
        MatOptionModule,
        MatSelectModule,
        MotorServoEndStateL10nKeyPipe,
        NgForOf
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

    public readonly motorServoEndStates: ReadonlyArray<MotorServoEndState> = [
        MotorServoEndState.float,
        MotorServoEndState.hold,
        MotorServoEndState.brake
    ];

    private _form?: ControlSchemeBindingOutputForm;

    public get form(): StepperOutputConfigurationForm | undefined {
        return this._form?.controls.stepperConfig;
    }

    public setOutputFormControl(
        outputFormControl: ControlSchemeBindingOutputForm
    ): void {
        this._form = outputFormControl;
    }
}
