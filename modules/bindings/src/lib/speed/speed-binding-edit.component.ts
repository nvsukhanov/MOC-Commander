import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { merge } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatError } from '@angular/material/form-field';
import { ControlSchemeBindingType, ValidationErrorsL10nMap, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-components';
import { InputPipeType, SpeedBindingInputAction } from '@app/store';
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
import { SpeedBindingForm } from './speed-binding-form';
import { NO_INPUTS_SET_SPEED_ERROR } from './speed-binding-form-builder.service';
import { SpeedBindingL10nService } from './speed-binding-l10n.service';

@Component({
  standalone: true,
  selector: 'lib-cs-speed-binding-edit',
  templateUrl: './speed-binding-edit.component.html',
  styleUrl: './speed-binding-edit.component.scss',
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
export class SpeedBindingEditComponent implements IBindingsDetailsEditComponent<SpeedBindingForm> {
  public readonly validationErrorsMap: ValidationErrorsL10nMap = {
    [NO_INPUTS_SET_SPEED_ERROR]: 'controlScheme.speedBinding.missingInputs',
  };

  public readonly inputActions = SpeedBindingInputAction;

  public readonly bindingType = ControlSchemeBindingType.Speed;

  public form?: SpeedBindingForm;

  private _forwardsControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null = null;

  private _backwardsControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null = null;

  private _brakeControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null = null;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly l10nService: SpeedBindingL10nService,
  ) {}

  public get forwardsControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null {
    return this._forwardsControlBindingComponentData;
  }

  public get backwardsControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null {
    return this._backwardsControlBindingComponentData;
  }

  public get brakeControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Speed> | null {
    return this._brakeControlBindingComponentData;
  }

  public setForm(outputBinding: SpeedBindingForm): void {
    const forwardsControls = outputBinding.controls.inputs.controls[SpeedBindingInputAction.Forwards].controls;
    const backwardsControls = outputBinding.controls.inputs.controls[SpeedBindingInputAction.Backwards].controls;
    const brakeControls = outputBinding.controls.inputs.controls[SpeedBindingInputAction.Brake].controls;
    if (outputBinding !== this.form) {
      this.form = outputBinding;

      this._forwardsControlBindingComponentData = {
        bindingType: ControlSchemeBindingType.Speed,
        inputFormGroup: outputBinding.controls.inputs.controls[SpeedBindingInputAction.Forwards],
        inputAction: SpeedBindingInputAction.Forwards,
        inputName$: this.l10nService.getBindingInputName(SpeedBindingInputAction.Forwards),
        supportedInputPipes: [InputPipeType.ExponentialGain, InputPipeType.LogarithmicGain, InputPipeType.OnOffToggle, InputPipeType.Pulse],
      };
      this._backwardsControlBindingComponentData = {
        bindingType: ControlSchemeBindingType.Speed,
        inputFormGroup: outputBinding.controls.inputs.controls[SpeedBindingInputAction.Backwards],
        inputAction: SpeedBindingInputAction.Backwards,
        inputName$: this.l10nService.getBindingInputName(SpeedBindingInputAction.Backwards),
        supportedInputPipes: [InputPipeType.ExponentialGain, InputPipeType.LogarithmicGain, InputPipeType.OnOffToggle, InputPipeType.Pulse],
      };
      this._brakeControlBindingComponentData = {
        bindingType: ControlSchemeBindingType.Speed,
        inputFormGroup: outputBinding.controls.inputs.controls[SpeedBindingInputAction.Brake],
        inputAction: SpeedBindingInputAction.Brake,
        inputName$: this.l10nService.getBindingInputName(SpeedBindingInputAction.Brake),
        supportedInputPipes: [InputPipeType.ExponentialGain, InputPipeType.LogarithmicGain, InputPipeType.OnOffToggle, InputPipeType.Pulse],
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
        brakeControls.inputType.valueChanges,
      ).subscribe(() => {
        this.cd.markForCheck();
      });
      this.cd.markForCheck();
    }
  }
}
