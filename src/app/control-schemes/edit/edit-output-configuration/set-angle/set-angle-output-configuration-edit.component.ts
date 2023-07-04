import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';

import { ControlSchemeBindingOutputForm, SetAngleOutputConfigurationForm } from '../../binding-output';
import { IOutputConfigurationRenderer } from '../i-output-configuration-renderer';
import { OutputConfigSliderControlComponent, OutputEndStateSelectorComponent, OutputNumInputControlComponent } from '../controls';

@Component({
    standalone: true,
    selector: 'app-set-angle-output-configuration-edit',
    templateUrl: './set-angle-output-configuration-edit.component.html',
    styleUrls: [ './set-angle-output-configuration-edit.component.scss' ],
    imports: [
        NgIf,
        OutputConfigSliderControlComponent,
        OutputNumInputControlComponent,
        OutputEndStateSelectorComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetAngleOutputConfigurationEditComponent implements IOutputConfigurationRenderer {
    public readonly motorLimits = MOTOR_LIMITS;

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
