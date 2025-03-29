import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBindingControllerInputNameResolver, IBindingTypeToL10nKeyMapper } from '@app/shared-control-schemes';
import { IBindingInputNameResolver } from '@app/control-scheme-view';
import { ControlSchemeBinding, ControlSchemeBindingInputs, ControlSchemeInputConfig } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingL10n } from './i-binding-l10n';
import { GearboxBindingL10nService } from './gearbox';
import { ServoBindingL10nService } from './servo';
import { SetAngleBindingL10nService } from './set-angle';
import { SpeedBindingL10nService } from './speed';
import { StepperBindingL10nService } from './stepper';
import { TrainBindingL10nService } from './train';
import { AccelerateBindingL10nService } from './accelerate';

@Injectable()
export class BindingL10nService
  implements IBindingControllerInputNameResolver, IBindingInputNameResolver, IBindingTypeToL10nKeyMapper
{
  private readonly bindingL10nServices: { [k in ControlSchemeBindingType]: IBindingL10n<k> } = {
    [ControlSchemeBindingType.Gearbox]: this.gearboxBindingL10nService,
    [ControlSchemeBindingType.Servo]: this.servoBindingL10nService,
    [ControlSchemeBindingType.SetAngle]: this.setAngleBindingL10nService,
    [ControlSchemeBindingType.Speed]: this.speedBindingL10nService,
    [ControlSchemeBindingType.Stepper]: this.stepperBindingL10nService,
    [ControlSchemeBindingType.Train]: this.trainBindingL10nService,
    [ControlSchemeBindingType.Accelerate]: this.accelerateBindingL10nService,
  };

  constructor(
    private readonly gearboxBindingL10nService: GearboxBindingL10nService,
    private readonly servoBindingL10nService: ServoBindingL10nService,
    private readonly setAngleBindingL10nService: SetAngleBindingL10nService,
    private readonly speedBindingL10nService: SpeedBindingL10nService,
    private readonly stepperBindingL10nService: StepperBindingL10nService,
    private readonly trainBindingL10nService: TrainBindingL10nService,
    private readonly accelerateBindingL10nService: AccelerateBindingL10nService,
  ) {}

  public getBindingActionName<T extends ControlSchemeBinding>(
    binding: T,
    action: keyof T['inputs'],
  ): Observable<string> {
    const p = this.getL10nService(binding.bindingType);
    return p.getBindingInputName(action as keyof ControlSchemeBindingInputs, binding);
  }

  public getControllerInputName<T extends ControlSchemeBindingType>(
    bindingType: T,
    actionType: keyof ControlSchemeBindingInputs<T>,
    data: ControlSchemeInputConfig,
  ): Observable<string> {
    return this.getL10nService(bindingType).getControllerInputName(actionType, data);
  }

  public mapBindingTypeToL10nKey(bindingType: ControlSchemeBindingType): string {
    return this.getL10nService(bindingType).bindingTypeL10nKey;
  }

  private getL10nService<T extends ControlSchemeBindingType>(bindingType: T): IBindingL10n<T> {
    return this.bindingL10nServices[bindingType];
  }
}
