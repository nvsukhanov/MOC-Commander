import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { ControllerInputType, HubIoOperationMode } from '@app/shared';
import { merge } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { ControllerSelectComponent, OutputConfigSliderControlComponent, OutputConfigToggleControlComponent } from '../controls';
import { IBindingsSpecificsComponent } from '../../i-bindings-specifics-component';
import { LinearBindingForm } from '../../../types';

@Component({
    standalone: true,
    selector: 'app-linear-output-configuration-edit',
    templateUrl: './linear-output-configuration-edit.component.html',
    styleUrls: [ './linear-output-configuration-edit.component.scss' ],
    imports: [
        NgIf,
        OutputConfigSliderControlComponent,
        OutputConfigToggleControlComponent,
        ControllerSelectComponent,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinearOutputConfigurationEditComponent implements IBindingsSpecificsComponent<LinearBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly linearHubIoOperationMode = HubIoOperationMode.Linear;

    public readonly controllerInputButtonType = ControllerInputType.Button;

    public form?: LinearBindingForm;

    constructor(
        private readonly cd: ChangeDetectorRef,
    ) {
    }

    public setForm(
        outputBinding: LinearBindingForm
    ): void {
        if (outputBinding !== this.form) {
            this.form = outputBinding;
            merge(
                outputBinding.controls.controllerId.valueChanges,
                outputBinding.controls.inputId.valueChanges,
                outputBinding.controls.inputType.valueChanges,
            ).subscribe(() => {
                this.cd.markForCheck();
            });
            this.cd.markForCheck();
        }
    }
}
