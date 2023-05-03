import { IOutputConfigurationRenderer } from '../i-output-configuration-renderer';
import { GamepadInputMethod, HubIoOperationMode } from '../../../../store';
import { ControlSchemeBindingOutputLinearControl } from '../../binding-output';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingInputControl } from '../../binding-input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule } from '@ngneat/transloco';
import { MatSliderModule } from '@angular/material/slider';
import { MOTOR_LIMITS } from '../../../../lego-hub';

@Component({
    standalone: true,
    selector: 'app-linear-output-configuration-edit',
    templateUrl: './linear-output-configuration-edit.component.html',
    styleUrls: [ './linear-output-configuration-edit.component.scss' ],
    imports: [
        MatFormFieldModule,
        MatInputModule,
        NgIf,
        ReactiveFormsModule,
        MatSlideToggleModule,
        TranslocoModule,
        MatSliderModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinearOutputConfigurationEditComponent implements IOutputConfigurationRenderer<HubIoOperationMode.Linear> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly motorSpeedStep = 10;

    public readonly motorPowerStep = 10;

    public readonly gamepadInputMethod = GamepadInputMethod;

    protected readonly GamepadInputMethod = GamepadInputMethod;

    private _outputBinding?: ControlSchemeBindingOutputLinearControl;

    private _inputMethodControl?: FormControl<GamepadInputMethod>;

    constructor(
        private readonly cd: ChangeDetectorRef
    ) {
    }

    public get outputBinding(): ControlSchemeBindingOutputLinearControl | undefined {
        return this._outputBinding;
    }

    public get inputMethodControl(): FormControl<GamepadInputMethod> | undefined {
        return this._inputMethodControl;
    }

    public setOutputFormControl(
        outputBinding: ControlSchemeBindingOutputLinearControl
    ): void {
        if (outputBinding !== this._outputBinding) {
            this._outputBinding = outputBinding;
            this.cd.detectChanges();
        }
    }

    public setInputFormControl(
        inputFormControl: ControlSchemeBindingInputControl
    ): void {
        if (inputFormControl.controls.gamepadInputMethod !== this._inputMethodControl) {
            this._inputMethodControl = inputFormControl.controls.gamepadInputMethod;
            this.cd.detectChanges();
        }
    }
}
