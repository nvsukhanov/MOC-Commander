import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ControlSchemeInputConfig, ControlSchemeSetAngleBinding, SetAngleBindingInputAction } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService } from '../common';

@Injectable()
export class SetAngleBindingL10nService implements IBindingL10n<ControlSchemeBindingType.SetAngle> {
    public readonly bindingTypeL10nKey = 'controlScheme.setAngleBinding.operationMode';

    constructor(
        private readonly transloco: TranslocoService,
        private readonly controllerNameProvider: ControllerInputNameService,
    ) {
    }

    public getBindingInputName(
        actionType: SetAngleBindingInputAction,
        binding: ControlSchemeSetAngleBinding
    ): Observable<string> {
        return this.transloco.selectTranslate('controlScheme.setAngleBinding.inputAction', binding);
    }

    public getBasicInputName(
        actionType: SetAngleBindingInputAction
    ): Observable<string> {
        switch (actionType) {
            case SetAngleBindingInputAction.SetAngle:
                return this.transloco.selectTranslate('controlScheme.setAngleBinding.basicInputAction');
        }
    }

    public getControllerInputName(
        actionType: SetAngleBindingInputAction,
        inputConfig: ControlSchemeInputConfig
    ): Observable<string> {
        switch (actionType) {
            case SetAngleBindingInputAction.SetAngle:
                return this.controllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
