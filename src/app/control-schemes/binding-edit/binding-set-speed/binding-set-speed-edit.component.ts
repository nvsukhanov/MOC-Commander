import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { merge } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { ControlSchemeBindingType, ControllerInputType, HideOnSmallScreenDirective, SliderControlComponent, ToggleControlComponent } from '@app/shared';
import { ControlSchemeInputAction } from '@app/store';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { ControlSchemeInputActionToL10nKeyPipe, InputFormGroup, SetSpeedBindingForm } from '../../common';
import { BindingControlSelectInputGainComponent } from '../control-select-input-gain';
import { BindingEditSectionComponent } from '../section';
import { BindingControlSelectHubComponent } from '../control-select-hub';
import { BindingControlSelectIoComponent } from '../control-select-io';
import { BindingEditSectionsContainerComponent } from '../sections-container';

@Component({
    standalone: true,
    selector: 'app-binding-set-speed-edit',
    templateUrl: './binding-set-speed-edit.component.html',
    styleUrls: [ './binding-set-speed-edit.component.scss' ],
    imports: [
        NgIf,
        BindingEditSectionComponent,
        TranslocoModule,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatDividerModule,
        BindingControlSelectControllerComponent,
        BindingControlSelectInputGainComponent,
        SliderControlComponent,
        HideOnSmallScreenDirective,
        ToggleControlComponent,
        ControlSchemeInputActionToL10nKeyPipe,
        BindingEditSectionsContainerComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSetSpeedEditComponent implements IBindingsDetailsEditComponent<SetSpeedBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

    public readonly bindingType = ControlSchemeBindingType.SetSpeed;

    public form?: SetSpeedBindingForm;

    constructor(
        private readonly cd: ChangeDetectorRef
    ) {
    }

    private get accelerationControl(): InputFormGroup | undefined {
        return this.form?.controls.inputs.controls[ControlSchemeInputAction.Accelerate];
    }

    public get isInputGainConfigurable(): boolean {
        return this.accelerationControl?.controls.inputType.value === ControllerInputType.Axis
            || this.accelerationControl?.controls.inputType.value === ControllerInputType.Trigger;
    }

    public setForm(
        outputBinding: SetSpeedBindingForm
    ): void {
        const accelerateControls = outputBinding.controls.inputs.controls[ControlSchemeInputAction.Accelerate].controls;
        if (outputBinding !== this.form) {
            this.form = outputBinding;
            merge(
                accelerateControls.controllerId.valueChanges,
                accelerateControls.inputId.valueChanges,
                accelerateControls.inputType.valueChanges,
            ).subscribe(() => {
                this.cd.markForCheck();
            });
            this.cd.markForCheck();
        }
    }
}
