import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { ControllerInputType, HubIoOperationMode } from '@app/shared';
import { merge } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { LinearBindingForm } from '../../types';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { BindingControlSliderComponent } from '../control-slider';
import { BindingControlToggleComponent } from '../control-toggle';

@Component({
    standalone: true,
    selector: 'app-binding-linear-edit',
    templateUrl: './binding-linear-edit.component.html',
    styleUrls: [ './binding-linear-edit.component.scss' ],
    imports: [
        NgIf,
        BindingControlSliderComponent,
        BindingControlToggleComponent,
        BindingControlSelectControllerComponent,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingLinearEditComponent implements IBindingsDetailsEditComponent<LinearBindingForm> {
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
