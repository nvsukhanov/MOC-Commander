import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { ControlSchemeBindingInputs, ControlSchemeInput, PortCommandTask, TrainInputAction } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingL10n } from '../i-binding-l10n';
import { DirectionAwareControllerInputNameService } from '../common';

@Injectable()
export class TrainBindingL10nService implements IBindingL10n<ControlSchemeBindingType.Train> {
    public readonly bindingTypeL10nKey = 'controlScheme.trainBinding.operationMode';

    constructor(
        private readonly translocoService: TranslocoService,
        private readonly directionAwareControllerNameProvider: DirectionAwareControllerInputNameService
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
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Train>,
    ): Observable<string> {
        switch (actionType) {
            case TrainInputAction.NextSpeed:
                return this.translocoService.selectTranslate('controlScheme.trainBinding.prevLevel');
            case TrainInputAction.PrevSpeed:
                return this.translocoService.selectTranslate('controlScheme.trainBinding.nextLevel');
            case TrainInputAction.Reset:
                return this.translocoService.selectTranslate('controlScheme.trainBinding.reset');
        }
    }

    public getControllerInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Train>,
        inputConfig: ControlSchemeInput
    ): Observable<string> {
        switch (actionType) {
            case TrainInputAction.NextSpeed:
            case TrainInputAction.PrevSpeed:
            case TrainInputAction.Reset:
                return this.directionAwareControllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }

}
