import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { ControlSchemeInput, PortCommandTask, TrainBindingInputAction } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService } from '../common';

@Injectable()
export class TrainBindingL10nService implements IBindingL10n<ControlSchemeBindingType.Train> {
    public readonly bindingTypeL10nKey = 'controlScheme.trainBinding.operationMode';

    constructor(
        private readonly translocoService: TranslocoService,
        private readonly controllerInputNameService: ControllerInputNameService
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.Train>
    ): Observable<string> {
        const level = task.payload.initialLevelIndex - task.payload.speedIndex;
        const speedPercent = Math.round((task.payload.speed / MOTOR_LIMITS.maxSpeed) * 100);
        const isLooping = task.payload.isLooping;
        return this.translocoService.selectTranslate('controlScheme.trainBinding.taskSummary', { level, speedPercent, isLooping });
    }

    public getBindingInputName(
        actionType: TrainBindingInputAction,
    ): Observable<string> {
        switch (actionType) {
            case TrainBindingInputAction.NextSpeed:
                return this.translocoService.selectTranslate('controlScheme.trainBinding.nextSpeed');
            case TrainBindingInputAction.PrevSpeed:
                return this.translocoService.selectTranslate('controlScheme.trainBinding.prevSpeed');
            case TrainBindingInputAction.Reset:
                return this.translocoService.selectTranslate('controlScheme.trainBinding.reset');
        }
    }

    public getControllerInputName(
        actionType: TrainBindingInputAction,
        inputConfig: ControlSchemeInput
    ): Observable<string> {
        switch (actionType) {
            case TrainBindingInputAction.NextSpeed:
            case TrainBindingInputAction.PrevSpeed:
            case TrainBindingInputAction.Reset:
                return this.controllerInputNameService.getFullControllerInputNameData(inputConfig);
        }
    }

}
