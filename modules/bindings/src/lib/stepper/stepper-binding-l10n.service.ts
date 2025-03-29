import { Observable } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeInputConfig, ControlSchemeStepperBinding, StepperBindingInputAction } from '@app/store';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService } from '../common';

@Injectable()
export class StepperBindingL10nService implements IBindingL10n<ControlSchemeBindingType.Stepper> {
  public readonly bindingTypeL10nKey = 'controlScheme.stepperBinding.operationMode';

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly controllerInputNameService: ControllerInputNameService,
  ) {}

  public getBindingInputName(
    actionType: StepperBindingInputAction,
    binding: ControlSchemeStepperBinding,
  ): Observable<string> {
    switch (actionType) {
      case StepperBindingInputAction.Cw:
        return this.translocoService.selectTranslate('controlScheme.stepperBinding.inputActionCw', binding);
      case StepperBindingInputAction.Ccw:
        return this.translocoService.selectTranslate('controlScheme.stepperBinding.inputActionCcw', binding);
    }
  }

  public getBasicInputName(actionType: StepperBindingInputAction): Observable<string> {
    switch (actionType) {
      case StepperBindingInputAction.Cw:
        return this.translocoService.selectTranslate('controlScheme.stepperBinding.basicInputActionCw');
      case StepperBindingInputAction.Ccw:
        return this.translocoService.selectTranslate('controlScheme.stepperBinding.basicInputActionCcw');
    }
  }

  public getControllerInputName(
    actionType: StepperBindingInputAction,
    inputConfig: ControlSchemeInputConfig,
  ): Observable<string> {
    switch (actionType) {
      case StepperBindingInputAction.Cw:
      case StepperBindingInputAction.Ccw:
        return this.controllerInputNameService.getFullControllerInputNameData(inputConfig);
    }
  }
}
