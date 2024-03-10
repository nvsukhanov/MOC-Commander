import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, calculateSpeedPower } from '@app/shared-misc';
import { ControlSchemeInputConfig, PortCommandTask, SpeedBindingInputAction } from '@app/store';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService } from '../common';

@Injectable()
export class SpeedBindingL10nService implements IBindingL10n<ControlSchemeBindingType.Speed> {
    public readonly bindingTypeL10nKey = 'controlScheme.speedBinding.operationMode';

    constructor(
        private readonly translocoService: TranslocoService,
        private readonly controllerInputNameService: ControllerInputNameService,
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.Speed>
    ): Observable<string> {
        const { speed, power } = calculateSpeedPower(task.payload.speed, task.payload.brakeFactor, task.payload.power);
        if (power !== 0 && speed === 0) {
            return this.translocoService.selectTranslate('controlScheme.speedBinding.brakeTaskSummary');
        }
        return this.translocoService.selectTranslate('controlScheme.speedBinding.taskSummary', { speed });
    }

    public getBindingInputName(
        actionType: SpeedBindingInputAction
    ): Observable<string> {
        switch (actionType) {
            case SpeedBindingInputAction.Forwards:
                return this.translocoService.selectTranslate('controlScheme.speedBinding.forwardsInput');
            case SpeedBindingInputAction.Backwards:
                return this.translocoService.selectTranslate('controlScheme.speedBinding.backwardsInput');
            case SpeedBindingInputAction.Brake:
                return this.translocoService.selectTranslate('controlScheme.speedBinding.brakeInput');
        }
    }

    public getControllerInputName(
        actionType: SpeedBindingInputAction,
        inputConfig: ControlSchemeInputConfig
    ): Observable<string> {
        switch (actionType) {
            case SpeedBindingInputAction.Forwards:
            case SpeedBindingInputAction.Backwards:
            case SpeedBindingInputAction.Brake:
                return this.controllerInputNameService.getFullControllerInputNameData(inputConfig);
        }
    }
}
