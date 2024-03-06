import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { merge } from 'rxjs';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatError } from '@angular/material/form-field';
import { ControllerInputType } from '@app/controller-profiles';
import { ControlSchemeBindingType, ValidationErrorsL10nMap, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-ui';
import { SpeedInputAction } from '@app/store';
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
import { SpeedBindingForm } from './speed-binding-form';
import { NO_INPUTS_SET_SPEED_ERROR } from './speed-binding-form-builder.service';
import { SpeedL10nService } from './speed-l10n.service';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-speed-edit',
    templateUrl: './binding-speed-edit.component.html',
    styleUrls: [ './binding-speed-edit.component.scss' ],
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
export class BindingSpeedEditComponent implements IBindingsDetailsEditComponent<SpeedBindingForm> {
    public readonly validationErrorsMap: ValidationErrorsL10nMap = {
        [NO_INPUTS_SET_SPEED_ERROR]: 'controlScheme.speedBinding.missingInputs'
    };

    public readonly inputActions = SpeedInputAction;

    public readonly bindingType = ControlSchemeBindingType.Speed;

    public form?: SpeedBindingForm;

    private _forwardsControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null = null;

    private _backwardsControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null = null;

    private _brakeControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null = null;

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly l10nService: SpeedL10nService
    ) {
    }

    private get forwardsControl(): OptionalInputFormGroup | undefined {
        return this.form?.controls.inputs.controls[SpeedInputAction.Forwards];
    }

    private get backwardsControl(): OptionalInputFormGroup | undefined {
        return this.form?.controls.inputs.controls[SpeedInputAction.Backwards];
    }

    public get forwardsControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null {
        return this._forwardsControlBindingComponentData;
    }

    public get backwardsControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null {
        return this._backwardsControlBindingComponentData;
    }

    public get brakeControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null {
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
        outputBinding: SpeedBindingForm
    ): void {
        const forwardsControls = outputBinding.controls.inputs.controls[SpeedInputAction.Forwards].controls;
        const backwardsControls = outputBinding.controls.inputs.controls[SpeedInputAction.Backwards].controls;
        const brakeControls = outputBinding.controls.inputs.controls[SpeedInputAction.Brake].controls;
        if (outputBinding !== this.form) {
            this.form = outputBinding;

            this._forwardsControlBindingComponentData = {
                bindingType: ControlSchemeBindingType.Speed,
                inputFormGroup: outputBinding.controls.inputs.controls[SpeedInputAction.Forwards],
                inputAction: SpeedInputAction.Forwards,
                inputName$: this.l10nService.getBindingInputName(SpeedInputAction.Forwards)
            };
            this._backwardsControlBindingComponentData = {
                bindingType: ControlSchemeBindingType.Speed,
                inputFormGroup: outputBinding.controls.inputs.controls[SpeedInputAction.Backwards],
                inputAction: SpeedInputAction.Backwards,
                inputName$: this.l10nService.getBindingInputName(SpeedInputAction.Backwards)
            };
            this._brakeControlBindingComponentData = {
                bindingType: ControlSchemeBindingType.Speed,
                inputFormGroup: outputBinding.controls.inputs.controls[SpeedInputAction.Brake],
                inputAction: SpeedInputAction.Brake,
                inputName$: this.l10nService.getBindingInputName(SpeedInputAction.Brake)
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
