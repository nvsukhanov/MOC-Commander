import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { MOTOR_LIMITS, MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { MotorServoEndStateL10nKeyPipe } from '@app/shared';
import { ControlSchemeBindingOutputForm, SetAngleOutputConfigurationForm } from '../../binding-output';
import { IOutputConfigurationRenderer } from '../i-output-configuration-renderer';

@Component({
    standalone: true,
    selector: 'app-set-angle-output-configuration-edit',
    templateUrl: './set-angle-output-configuration-edit.component.html',
    styleUrls: [ './set-angle-output-configuration-edit.component.scss' ],
    imports: [
        NgIf,
        JsonPipe,
        MatSlideToggleModule,
        TranslocoModule,
        ReactiveFormsModule,
        MatSliderModule,
        MatFormFieldModule,
        MatSelectModule,
        NgForOf,
        MotorServoEndStateL10nKeyPipe,
        MatInputModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetAngleOutputConfigurationEditComponent implements IOutputConfigurationRenderer {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly motorServoEndStates: ReadonlyArray<MotorServoEndState> = [
        MotorServoEndState.float,
        MotorServoEndState.hold,
        MotorServoEndState.brake
    ];

    private _configurationForm?: SetAngleOutputConfigurationForm;

    constructor(
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    public get configurationForm(): SetAngleOutputConfigurationForm | undefined {
        return this._configurationForm;
    }

    public setOutputFormControl(
        outputFormControl: ControlSchemeBindingOutputForm
    ): void {
        if (outputFormControl.controls.setAngleConfig !== this._configurationForm) {
            this._configurationForm = outputFormControl.controls.setAngleConfig;
            this.cdRef.detectChanges();
        }
    }
}
