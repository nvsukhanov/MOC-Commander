import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { merge } from 'rxjs';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { ControllerInputType } from '@app/controller-profiles';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-ui';
import { ControlSchemeInputAction } from '@app/store';
import { BindingControlSelectHubComponent, BindingControlSelectIoComponent } from '@app/shared-control-schemes';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import {
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectInputGainComponent,
    BindingControlSpeedInputComponent,
    BindingEditSectionComponent,
    BindingEditSectionsContainerComponent,
    ControlSchemeInputActionToL10nKeyPipe,
    InputFormGroup
} from '../common';
import { SetSpeedBindingForm } from './set-speed-binding-form';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-set-speed-edit',
    templateUrl: './binding-set-speed-edit.component.html',
    styleUrls: [ './binding-set-speed-edit.component.scss' ],
    imports: [
        NgIf,
        BindingEditSectionComponent,
        TranslocoPipe,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatDividerModule,
        BindingControlSelectControllerComponent,
        BindingControlSelectInputGainComponent,
        HideOnSmallScreenDirective,
        ToggleControlComponent,
        ControlSchemeInputActionToL10nKeyPipe,
        BindingEditSectionsContainerComponent,
        BindingControlPowerInputComponent,
        BindingControlSpeedInputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSetSpeedEditComponent implements IBindingsDetailsEditComponent<SetSpeedBindingForm> {
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
