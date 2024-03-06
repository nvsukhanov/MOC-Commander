import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, calculateSpeedPower } from '@app/shared-misc';
import { ControlSchemeBindingInputs, ControlSchemeInput, PortCommandTask, SpeedInputAction } from '@app/store';

import { IBindingL10n } from '../i-binding-l10n';
import { DirectionAwareControllerInputNameService } from '../common';

@Injectable()
export class SpeedL10nService implements IBindingL10n<ControlSchemeBindingType.Speed> {
    public readonly bindingTypeL10nKey = 'controlScheme.speedBinding.operationMode';

    constructor(
        private readonly translocoService: TranslocoService,
        private readonly controllerNameProvider: DirectionAwareControllerInputNameService,
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
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Speed>
    ): Observable<string> {
        switch (actionType) {
            case SpeedInputAction.Forwards:
                return this.translocoService.selectTranslate('controlScheme.speedBinding.forwardsInput');
            case SpeedInputAction.Backwards:
                return this.translocoService.selectTranslate('controlScheme.speedBinding.backwardsInput');
            case SpeedInputAction.Brake:
                return this.translocoService.selectTranslate('controlScheme.speedBinding.brakeInput');
        }
    }

    public getControllerInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Speed>,
        inputConfig: ControlSchemeInput
    ): Observable<string> {
        switch (actionType) {
            case SpeedInputAction.Forwards:
            case SpeedInputAction.Backwards:
            case SpeedInputAction.Brake:
                return this.controllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
