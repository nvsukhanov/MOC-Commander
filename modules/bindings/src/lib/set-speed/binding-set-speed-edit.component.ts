import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { merge } from 'rxjs';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatError } from '@angular/material/form-field';
import { ControllerInputType } from '@app/controller-profiles';
import { ControlSchemeBindingType, ValidationErrorsL10nMap, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-ui';
import { SetSpeedInputAction } from '@app/store';
import { BindingControlSelectHubComponent, BindingControlSelectIoComponent } from '@app/shared-control-schemes';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import {
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectControllerComponentData,
    BindingControlSelectInputGainComponent,
    BindingControlSpeedInputComponent,
    BindingEditSectionComponent,
    BindingEditSectionsContainerComponent,
    OptionalInputFormGroup
} from '../common';
import { SetSpeedBindingForm } from './set-speed-binding-form';
import { NO_INPUTS_SET_SPEED_ERROR } from './set-speed-binding-form-builder.service';
import { SetSpeedL10nService } from './set-speed-l10n.service';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-set-speed-edit',
    templateUrl: './binding-set-speed-edit.component.html',
    styleUrls: [ './binding-set-speed-edit.component.scss' ],
    imports: [
        BindingEditSectionComponent,
        TranslocoPipe,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatDividerModule,
        BindingControlSelectControllerComponent,
        BindingControlSelectInputGainComponent,
        HideOnSmallScreenDirective,
        ToggleControlComponent,
        BindingEditSectionsContainerComponent,
        BindingControlPowerInputComponent,
        BindingControlSpeedInputComponent,
        MatError,
        ValidationMessagesDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSetSpeedEditComponent implements IBindingsDetailsEditComponent<SetSpeedBindingForm> {
    public readonly validationErrorsMap: ValidationErrorsL10nMap = {
        [NO_INPUTS_SET_SPEED_ERROR]: 'controlScheme.setSpeedBinding.missingInputs'
    };

    public readonly inputActions = SetSpeedInputAction;

    public readonly bindingType = ControlSchemeBindingType.SetSpeed;

    public form?: SetSpeedBindingForm;

    private _forwardsControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.SetSpeed> | null = null;

    private _backwardsControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.SetSpeed> | null = null;

    private _brakeControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.SetSpeed> | null = null;

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly l10nService: SetSpeedL10nService
    ) {
    }

    private get forwardsControl(): OptionalInputFormGroup | undefined {
        return this.form?.controls.inputs.controls[SetSpeedInputAction.Forwards];
    }

    private get backwardsControl(): OptionalInputFormGroup | undefined {
        return this.form?.controls.inputs.controls[SetSpeedInputAction.Backwards];
    }

    public get forwardsControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.SetSpeed> | null {
        return this._forwardsControlBindingComponentData;
    }

    public get backwardsControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.SetSpeed> | null {
        return this._backwardsControlBindingComponentData;
    }

    public get brakeControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.SetSpeed> | null {
        return this._brakeControlBindingComponentData;
    }

    public get isForwardInputGainConfigurable(): boolean {
        return this.forwardsControl?.controls.inputType.value === ControllerInputType.Axis
            || this.forwardsControl?.controls.inputType.value === ControllerInputType.Trigger;
    }

    public get isBackwardInputGainConfigurable(): boolean {
        return this.backwardsControl?.controls.inputType.value === ControllerInputType.Axis
            || this.backwardsControl?.controls.inputType.value === ControllerInputType.Trigger;
    }

    public setForm(
        outputBinding: SetSpeedBindingForm
    ): void {
        const forwardsControls = outputBinding.controls.inputs.controls[SetSpeedInputAction.Forwards].controls;
        const backwardsControls = outputBinding.controls.inputs.controls[SetSpeedInputAction.Backwards].controls;
        const brakeControls = outputBinding.controls.inputs.controls[SetSpeedInputAction.Brake].controls;
        if (outputBinding !== this.form) {
            this.form = outputBinding;

            this._forwardsControlBindingComponentData = {
                bindingType: ControlSchemeBindingType.SetSpeed,
                inputFormGroup: outputBinding.controls.inputs.controls[SetSpeedInputAction.Forwards],
                inputAction: SetSpeedInputAction.Forwards,
                inputName$: this.l10nService.getBindingInputName(SetSpeedInputAction.Forwards)
            };
            this._backwardsControlBindingComponentData = {
                bindingType: ControlSchemeBindingType.SetSpeed,
                inputFormGroup: outputBinding.controls.inputs.controls[SetSpeedInputAction.Backwards],
                inputAction: SetSpeedInputAction.Backwards,
                inputName$: this.l10nService.getBindingInputName(SetSpeedInputAction.Backwards)
            };
            this._brakeControlBindingComponentData = {
                bindingType: ControlSchemeBindingType.SetSpeed,
                inputFormGroup: outputBinding.controls.inputs.controls[SetSpeedInputAction.Brake],
                inputAction: SetSpeedInputAction.Brake,
                inputName$: this.l10nService.getBindingInputName(SetSpeedInputAction.Brake)
            };

            merge(
                forwardsControls.controllerId.valueChanges,
                forwardsControls.inputId.valueChanges,
                forwardsControls.inputType.valueChanges,
                backwardsControls.controllerId.valueChanges,
                backwardsControls.inputId.valueChanges,
                backwardsControls.inputType.valueChanges,
                brakeControls.controllerId.valueChanges,
                brakeControls.inputId.valueChanges,
                brakeControls.inputType.valueChanges
            ).subscribe(() => {
                this.cd.markForCheck();
            });
            this.cd.markForCheck();
        }
    }
}
