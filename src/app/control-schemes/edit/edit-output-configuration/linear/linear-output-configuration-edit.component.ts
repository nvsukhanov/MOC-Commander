import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@ngneat/transloco';
import { MatSliderModule } from '@angular/material/slider';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ControlSchemeBindingOutputForm } from '../../binding-output';
import { ControlSchemeBindingInputForm } from '../../binding-input';
import { IOutputConfigurationRenderer } from '../i-output-configuration-renderer';
import { ControllerInputType } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-linear-output-configuration-edit',
    templateUrl: './linear-output-configuration-edit.component.html',
    styleUrls: [ './linear-output-configuration-edit.component.scss' ],
    imports: [
        NgIf,
        ReactiveFormsModule,
        MatSlideToggleModule,
        TranslocoModule,
        MatSliderModule,
        MatFormFieldModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinearOutputConfigurationEditComponent implements IOutputConfigurationRenderer {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly controllerInputType = ControllerInputType;

    private _outputBinding?: ControlSchemeBindingOutputForm;

    private _inputMethodControl?: FormControl<ControllerInputType>;

    constructor(
        private readonly cd: ChangeDetectorRef
    ) {
    }

    public get outputBinding(): ControlSchemeBindingOutputForm | undefined {
        return this._outputBinding;
    }

    public get inputMethodControl(): FormControl<ControllerInputType> | undefined {
        return this._inputMethodControl;
    }

    public setOutputFormControl(
        outputBinding: ControlSchemeBindingOutputForm
    ): void {
        if (outputBinding !== this._outputBinding) {
            this._outputBinding = outputBinding;
            this.cd.detectChanges();
        }
    }

    public setInputFormControl(
        inputFormControl: ControlSchemeBindingInputForm
    ): void {
        if (inputFormControl.controls.inputType !== this._inputMethodControl) {
            this._inputMethodControl = inputFormControl.controls.inputType;
            this.cd.detectChanges();
        }
    }
}
