import { Observable } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeInputConfig, PowerBindingInputAction } from '@app/store';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService } from '../common';

@Injectable()
export class PowerBindingL10nService implements IBindingL10n<ControlSchemeBindingType.Power> {
  public readonly bindingTypeL10nKey = 'controlScheme.powerBinding.operationMode';

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly controllerInputNameService: ControllerInputNameService,
  ) {}

  public getBindingInputName(actionType: PowerBindingInputAction): Observable<string> {
    switch (actionType) {
      case PowerBindingInputAction.Forwards:
        return this.translocoService.selectTranslate('controlScheme.powerBinding.forwardsInput');
      case PowerBindingInputAction.Backwards:
        return this.translocoService.selectTranslate('controlScheme.powerBinding.backwardsInput');
    }
  }

  public getControllerInputName(
    actionType: PowerBindingInputAction,
    inputConfig: ControlSchemeInputConfig,
  ): Observable<string> {
    switch (actionType) {
      case PowerBindingInputAction.Forwards:
      case PowerBindingInputAction.Backwards:
        return this.controllerInputNameService.getFullControllerInputNameData(inputConfig);
    }
  }
}
