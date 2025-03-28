import { Observable } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { AccelerateBindingInputAction, ControlSchemeInputConfig } from '@app/store';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService } from '../common';

@Injectable()
export class AccelerateBindingL10nService implements IBindingL10n<ControlSchemeBindingType.Accelerate> {
  public readonly bindingTypeL10nKey = 'controlScheme.accelerateBinding.operationMode';

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly controllerInputNameService: ControllerInputNameService,
  ) {}

  public getBindingInputName(actionType: AccelerateBindingInputAction): Observable<string> {
    switch (actionType) {
      case AccelerateBindingInputAction.Forwards:
        return this.translocoService.selectTranslate('controlScheme.accelerateBinding.forwardsInput');
      case AccelerateBindingInputAction.Backwards:
        return this.translocoService.selectTranslate('controlScheme.accelerateBinding.backwardsInput');
      case AccelerateBindingInputAction.Decelerate:
        return this.translocoService.selectTranslate('controlScheme.accelerateBinding.decelerateInput');
    }
  }

  public getControllerInputName(actionType: AccelerateBindingInputAction, inputConfig: ControlSchemeInputConfig): Observable<string> {
    switch (actionType) {
      case AccelerateBindingInputAction.Forwards:
      case AccelerateBindingInputAction.Backwards:
      case AccelerateBindingInputAction.Decelerate:
        return this.controllerInputNameService.getFullControllerInputNameData(inputConfig);
    }
  }
}
