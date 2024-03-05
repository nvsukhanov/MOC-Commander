import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { merge } from 'rxjs';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatError } from '@angular/material/form-field';
import { ControllerInputType } from '@app/controller-profiles';
import { ControlSchemeBindingType, ValidationErrorsL10nMap, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-ui';
import { ControlSchemeInputAction } from '@app/store';
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

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

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
        return this.form?.controls.inputs.controls[ControlSchemeInputAction.Forwards];
    }

    private get backwardsControl(): OptionalInputFormGroup | undefined {
        return this.form?.controls.inputs.controls[ControlSchemeInputAction.Backwards];
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
        const forwardsControls = outputBinding.controls.inputs.controls[ControlSchemeInputAction.Forwards].controls;
        const backwardsControls = outputBinding.controls.inputs.controls[ControlSchemeInputAction.Forwards].controls;
        const brakeControls = outputBinding.controls.inputs.controls[ControlSchemeInputAction.Brake].controls;
        if (outputBinding !== this.form) {
            this.form = outputBinding;

            this._forwardsControlBindingComponentData = {
                bindingType: ControlSchemeBindingType.SetSpeed,
                inputFormGroup: outputBinding.controls.inputs.controls[ControlSchemeInputAction.Forwards],
                inputAction: ControlSchemeInputAction.Forwards,
                inputName$: this.l10nService.getBindingInputName(ControlSchemeInputAction.Forwards)
            };
            this._backwardsControlBindingComponentData = {
                bindingType: ControlSchemeBindingType.SetSpeed,
                inputFormGroup: outputBinding.controls.inputs.controls[ControlSchemeInputAction.Backwards],
                inputAction: ControlSchemeInputAction.Backwards,
                inputName$: this.l10nService.getBindingInputName(ControlSchemeInputAction.Backwards)
            };
            this._brakeControlBindingComponentData = {
                bindingType: ControlSchemeBindingType.SetSpeed,
                inputFormGroup: outputBinding.controls.inputs.controls[ControlSchemeInputAction.Brake],
                inputAction: ControlSchemeInputAction.Brake,
                inputName$: this.l10nService.getBindingInputName(ControlSchemeInputAction.Brake)
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
