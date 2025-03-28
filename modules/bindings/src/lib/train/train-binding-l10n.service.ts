import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { ControlSchemeInputConfig, TrainBindingInputAction } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService } from '../common';

@Injectable()
export class TrainBindingL10nService implements IBindingL10n<ControlSchemeBindingType.Train> {
  public readonly bindingTypeL10nKey = 'controlScheme.trainBinding.operationMode';

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly controllerInputNameService: ControllerInputNameService,
  ) {}

  public getBindingInputName(actionType: TrainBindingInputAction): Observable<string> {
    switch (actionType) {
      case TrainBindingInputAction.NextSpeed:
        return this.translocoService.selectTranslate('controlScheme.trainBinding.nextSpeed');
      case TrainBindingInputAction.PrevSpeed:
        return this.translocoService.selectTranslate('controlScheme.trainBinding.prevSpeed');
      case TrainBindingInputAction.Reset:
        return this.translocoService.selectTranslate('controlScheme.trainBinding.reset');
    }
  }

  public getControllerInputName(actionType: TrainBindingInputAction, inputConfig: ControlSchemeInputConfig): Observable<string> {
    switch (actionType) {
      case TrainBindingInputAction.NextSpeed:
      case TrainBindingInputAction.PrevSpeed:
      case TrainBindingInputAction.Reset:
        return this.controllerInputNameService.getFullControllerInputNameData(inputConfig);
    }
  }
}
