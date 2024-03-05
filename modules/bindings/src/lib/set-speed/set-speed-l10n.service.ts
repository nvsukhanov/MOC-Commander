import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, calculateSpeedPower } from '@app/shared-misc';
import { ControlSchemeBindingInputs, ControlSchemeInput, PortCommandTask, SetSpeedInputAction } from '@app/store';

import { IBindingL10n } from '../i-binding-l10n';
import { DirectionAwareControllerInputNameService } from '../common';

@Injectable()
export class SetSpeedL10nService implements IBindingL10n<ControlSchemeBindingType.SetSpeed> {
    public readonly bindingTypeL10nKey = 'controlScheme.setSpeedBinding.operationMode';

    constructor(
        private readonly translocoService: TranslocoService,
        private readonly controllerNameProvider: DirectionAwareControllerInputNameService,
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.SetSpeed>
    ): Observable<string> {
        const { speed, power } = calculateSpeedPower(task.payload.speed, task.payload.brakeFactor, task.payload.power);
        if (power !== 0 && speed === 0) {
            return this.translocoService.selectTranslate('controlScheme.setSpeedBinding.brakeTaskSummary');
        }
        return this.translocoService.selectTranslate('controlScheme.setSpeedBinding.taskSummary', { speed });
    }

    public getBindingInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.SetSpeed>
    ): Observable<string> {
        switch (actionType) {
            case SetSpeedInputAction.Forwards:
                return this.translocoService.selectTranslate('controlScheme.setSpeedBinding.forwardsInput');
            case SetSpeedInputAction.Backwards:
                return this.translocoService.selectTranslate('controlScheme.setSpeedBinding.backwardsInput');
            case SetSpeedInputAction.Brake:
                return this.translocoService.selectTranslate('controlScheme.setSpeedBinding.brakeInput');
        }
    }

    public getControllerInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.SetSpeed>,
        inputConfig: ControlSchemeInput
    ): Observable<string> {
        switch (actionType) {
            case SetSpeedInputAction.Forwards:
            case SetSpeedInputAction.Backwards:
            case SetSpeedInputAction.Brake:
                return this.controllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
