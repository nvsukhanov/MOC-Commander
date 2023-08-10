import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { merge } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { ControllerInputType, HubIoOperationMode, SliderControlComponent, ToggleControlComponent } from '@app/shared';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { LinearBindingForm } from '../types';
import { BindingInputGainSelectComponent } from '../control-axial-output-modifier-select';

@Component({
    standalone: true,
    selector: 'app-binding-linear-edit',
    templateUrl: './binding-linear-edit.component.html',
    styleUrls: [ './binding-linear-edit.component.scss' ],
    imports: [
        NgIf,
        SliderControlComponent,
        ToggleControlComponent,
        BindingControlSelectControllerComponent,
        TranslocoModule,
        BindingInputGainSelectComponent
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

    public get isAxialInput(): boolean {
        return this.form?.controls.inputType.value === ControllerInputType.Axis;
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
