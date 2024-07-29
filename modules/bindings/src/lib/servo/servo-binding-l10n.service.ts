import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeInputConfig, ServoBindingInputAction } from '@app/store';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService } from '../common';

@Injectable()
export class ServoBindingL10nService implements IBindingL10n<ControlSchemeBindingType.Servo> {
    public readonly bindingTypeL10nKey = 'controlScheme.servoBinding.operationMode';

    constructor(
        private readonly controllerInputNameService: ControllerInputNameService,
        private readonly translocoService: TranslocoService,
    ) {
    }

    public getBindingInputName(
        actionType: ServoBindingInputAction,
    ): Observable<string> {
        switch (actionType) {
            case ServoBindingInputAction.Cw:
                return this.translocoService.selectTranslate('controlScheme.servoBinding.cwAction');
            case ServoBindingInputAction.Ccw:
                return this.translocoService.selectTranslate('controlScheme.servoBinding.ccwAction');
        }
    }

    public getControllerInputName(
        actionType: ServoBindingInputAction,
        inputConfig: ControlSchemeInputConfig
    ): Observable<string> {
        switch (actionType) {
            case ServoBindingInputAction.Cw:
            case ServoBindingInputAction.Ccw:
                return this.controllerInputNameService.getFullControllerInputNameData(inputConfig);
        }
    }
}
