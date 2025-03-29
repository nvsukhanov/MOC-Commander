import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { merge } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatError } from '@angular/material/form-field';
import { ControlSchemeBindingType, ValidationErrorsL10nMap, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-components';
import { AccelerateBindingInputAction, InputPipeType, SpeedBindingInputAction } from '@app/store';
import { BindingControlSelectHubComponent, BindingControlSelectIoComponent } from '@app/shared-control-schemes';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import {
  BindingControlPowerInputComponent,
  BindingControlSelectControllerComponent,
  BindingControlSelectControllerComponentData,
  BindingControlSpeedInputComponent,
  BindingEditSectionComponent,
  BindingEditSectionsContainerComponent,
} from '../common';
import { AccelerateBindingForm } from './accelerate-binding-form';
import { NO_INPUTS_ACCELERATE_ERROR } from './accelerate-binding-form-builder.service';
import { AccelerateBindingL10nService } from './accelerate-binding-l10n.service';

@Component({
  standalone: true,
  selector: 'lib-cs-speed-binding-edit',
  templateUrl: './accelerate-binding-edit.component.html',
  styleUrl: './accelerate-binding-edit.component.scss',
  imports: [
    BindingEditSectionComponent,
    TranslocoPipe,
    BindingControlSelectHubComponent,
    BindingControlSelectIoComponent,
    MatDividerModule,
    BindingControlSelectControllerComponent,
    HideOnSmallScreenDirective,
    ToggleControlComponent,
    BindingEditSectionsContainerComponent,
    BindingControlPowerInputComponent,
    BindingControlSpeedInputComponent,
    MatError,
    ValidationMessagesDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccelerateBindingEditComponent implements IBindingsDetailsEditComponent<AccelerateBindingForm> {
  public readonly validationErrorsMap: ValidationErrorsL10nMap = {
    [NO_INPUTS_ACCELERATE_ERROR]: 'controlScheme.accelerateBinding.missingInputs',
  };

  public readonly bindingType = ControlSchemeBindingType.Speed;

  public form?: AccelerateBindingForm;

  private _forwardsControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null =
    null;

  private _backwardsControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null =
    null;

  private _decelerateControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null =
    null;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly l10nService: AccelerateBindingL10nService,
  ) {}

  public get forwardsControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null {
    return this._forwardsControlBindingComponentData;
  }

  public get backwardsControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null {
    return this._backwardsControlBindingComponentData;
  }

  public get decelerateControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null {
    return this._decelerateControlBindingComponentData;
  }

  public get isForwardsControlAssigned(): boolean {
    return !!this.form?.controls.inputs.controls[SpeedBindingInputAction.Forwards].controls.controllerId.value;
  }

  public get isBackwardsControlAssigned(): boolean {
    return !!this.form?.controls.inputs.controls[SpeedBindingInputAction.Backwards].controls.controllerId.value;
  }

  public get isDecelerateControlAssigned(): boolean {
    return !!this.form?.controls.inputs.controls[SpeedBindingInputAction.Brake].controls.controllerId.value;
  }

  public setForm(outputBinding: AccelerateBindingForm): void {
    const forwardsControls = outputBinding.controls.inputs.controls[SpeedBindingInputAction.Forwards].controls;
    const backwardsControls = outputBinding.controls.inputs.controls[SpeedBindingInputAction.Backwards].controls;
    const decelerateControls = outputBinding.controls.inputs.controls[SpeedBindingInputAction.Brake].controls;
    if (outputBinding !== this.form) {
      this.form = outputBinding;

      this._forwardsControlBindingComponentData = {
        bindingType: ControlSchemeBindingType.Speed,
        inputFormGroup: outputBinding.controls.inputs.controls[AccelerateBindingInputAction.Forwards],
        inputAction: SpeedBindingInputAction.Forwards,
        inputName$: this.l10nService.getBindingInputName(AccelerateBindingInputAction.Forwards),
        supportedInputPipes: [InputPipeType.Pulse],
      };
      this._backwardsControlBindingComponentData = {
        bindingType: ControlSchemeBindingType.Speed,
        inputFormGroup: outputBinding.controls.inputs.controls[AccelerateBindingInputAction.Backwards],
        inputAction: SpeedBindingInputAction.Backwards,
        inputName$: this.l10nService.getBindingInputName(AccelerateBindingInputAction.Backwards),
        supportedInputPipes: [InputPipeType.Pulse],
      };
      this._decelerateControlBindingComponentData = {
        bindingType: ControlSchemeBindingType.Speed,
        inputFormGroup: outputBinding.controls.inputs.controls[AccelerateBindingInputAction.Decelerate],
        inputAction: SpeedBindingInputAction.Brake,
        inputName$: this.l10nService.getBindingInputName(AccelerateBindingInputAction.Decelerate),
        supportedInputPipes: [InputPipeType.Pulse],
      };

      merge(
        forwardsControls.controllerId.valueChanges,
        forwardsControls.inputId.valueChanges,
        forwardsControls.inputType.valueChanges,
        backwardsControls.controllerId.valueChanges,
        backwardsControls.inputId.valueChanges,
        backwardsControls.inputType.valueChanges,
        decelerateControls.controllerId.valueChanges,
        decelerateControls.inputId.valueChanges,
        decelerateControls.inputType.valueChanges,
      ).subscribe(() => {
        this.cd.markForCheck();
      });
      this.cd.markForCheck();
    }
  }
}
