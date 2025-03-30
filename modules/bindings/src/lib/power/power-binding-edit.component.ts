import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription, merge, startWith, switchMap } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatError } from '@angular/material/form-field';
import { ControlSchemeBindingType, ValidationErrorsL10nMap, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-components';
import { ATTACHED_IO_PORT_MODE_INFO_SELECTORS, InputPipeType, PowerBindingInputAction } from '@app/store';
import {
  BindingControlSelectHubComponent,
  BindingControlSelectIoComponent,
  POWER_BINDING_PORT_MODES,
} from '@app/shared-control-schemes';
import { Store } from '@ngrx/store';
import { PortModeName } from 'rxpoweredup';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import {
  BindingControlPowerInputComponent,
  BindingControlSelectControllerComponent,
  BindingControlSelectControllerComponentData,
  BindingEditSectionComponent,
  BindingEditSectionsContainerComponent,
} from '../common';
import { PowerBindingForm } from './power-binding-form';
import { NO_INPUTS_SET_POWER_ERROR } from './power-binding-form-builder.service';
import { PowerBindingL10nService } from './power-binding-l10n.service';

@Component({
  standalone: true,
  selector: 'lib-cs-power-binding-edit',
  templateUrl: './power-binding-edit.component.html',
  styleUrl: './power-binding-edit.component.scss',
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
    MatError,
    ValidationMessagesDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PowerBindingEditComponent implements IBindingsDetailsEditComponent<PowerBindingForm>, OnDestroy {
  public readonly validationErrorsMap: ValidationErrorsL10nMap = {
    [NO_INPUTS_SET_POWER_ERROR]: 'controlScheme.powerBinding.missingInputs',
  };

  public readonly bindingType = ControlSchemeBindingType.Power;

  public form?: PowerBindingForm;

  private _forwardsControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Power> | null =
    null;

  private _backwardsControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Power> | null =
    null;

  private readonly portModeNames: ReadonlySet<PortModeName> = new Set(POWER_BINDING_PORT_MODES);

  private subs = new Subscription();

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly l10nService: PowerBindingL10nService,
    private readonly store: Store,
  ) {}

  public get forwardsControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Power> | null {
    return this._forwardsControlBindingComponentData;
  }

  public get backwardsControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Power> | null {
    return this._backwardsControlBindingComponentData;
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public setForm(outputBinding: PowerBindingForm): void {
    this.subs.unsubscribe();
    this.subs = new Subscription();

    const forwardsControls = outputBinding.controls.inputs.controls[PowerBindingInputAction.Forwards].controls;
    const backwardsControls = outputBinding.controls.inputs.controls[PowerBindingInputAction.Backwards].controls;
    const hubIdControl = outputBinding.controls.hubId;
    const portIdControl = outputBinding.controls.portId;

    if (outputBinding !== this.form) {
      this.form = outputBinding;

      this._forwardsControlBindingComponentData = {
        bindingType: ControlSchemeBindingType.Power,
        inputFormGroup: outputBinding.controls.inputs.controls[PowerBindingInputAction.Forwards],
        inputAction: PowerBindingInputAction.Forwards,
        inputName$: this.l10nService.getBindingInputName(PowerBindingInputAction.Forwards),
        supportedInputPipes: [
          InputPipeType.ExponentialGain,
          InputPipeType.LogarithmicGain,
          InputPipeType.OnOffToggle,
          InputPipeType.Pulse,
        ],
      };
      this._backwardsControlBindingComponentData = {
        bindingType: ControlSchemeBindingType.Power,
        inputFormGroup: outputBinding.controls.inputs.controls[PowerBindingInputAction.Backwards],
        inputAction: PowerBindingInputAction.Backwards,
        inputName$: this.l10nService.getBindingInputName(PowerBindingInputAction.Backwards),
        supportedInputPipes: [
          InputPipeType.ExponentialGain,
          InputPipeType.LogarithmicGain,
          InputPipeType.OnOffToggle,
          InputPipeType.Pulse,
        ],
      };

      this.subs.add(
        merge(
          forwardsControls.controllerId.valueChanges,
          forwardsControls.inputId.valueChanges,
          forwardsControls.inputType.valueChanges,
          backwardsControls.controllerId.valueChanges,
          backwardsControls.inputId.valueChanges,
          backwardsControls.inputType.valueChanges,
        ).subscribe(() => {
          this.cd.markForCheck();
        }),
      );

      /**
       * On form initialization we need to store current modeId for the selected hubId and portId
       * that is used for the binding.
       */
      this.subs.add(
        merge(hubIdControl.valueChanges, portIdControl.valueChanges)
          .pipe(
            startWith(null),
            switchMap(() => {
              const hubId = hubIdControl.getRawValue();
              const portId = portIdControl.getRawValue();

              if (hubId === null || portId === null) {
                return [];
              }

              return this.store.select(
                ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectIoOutputPortModeIdAtPort({
                  hubId,
                  portId,
                  portModeNames: this.portModeNames,
                }),
              );
            }),
          )
          .subscribe((modeId) => this.form?.controls.modeId.setValue(modeId)),
      );

      this.cd.markForCheck();
    }
  }
}
