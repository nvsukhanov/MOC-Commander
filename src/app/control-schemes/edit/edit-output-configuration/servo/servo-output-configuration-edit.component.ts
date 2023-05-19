import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { IOutputConfigurationRenderer } from '../i-output-configuration-renderer';
import { ControlSchemeBindingOutputForm } from '../../binding-output';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    standalone: true,
    selector: 'app-servo-output-configuration-edit',
    templateUrl: './servo-output-configuration-edit.component.html',
    styleUrls: [ './servo-output-configuration-edit.component.scss' ],
    imports: [
        NgIf,
        MatSliderModule,
        ReactiveFormsModule,
        TranslocoModule,
        MatSlideToggleModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoOutputConfigurationEditComponent implements IOutputConfigurationRenderer {
    public readonly motorLimits = MOTOR_LIMITS;

    private _outputBinding?: ControlSchemeBindingOutputForm;

    constructor(
        private readonly cd: ChangeDetectorRef
    ) {
    }

    public get outputBinding(): ControlSchemeBindingOutputForm | undefined {
        return this._outputBinding;
    }

    public setOutputFormControl(
        outputBinding: ControlSchemeBindingOutputForm
    ): void {
        if (outputBinding !== this._outputBinding) {
            this._outputBinding = outputBinding;
            this.cd.detectChanges();
        }
    }
}
