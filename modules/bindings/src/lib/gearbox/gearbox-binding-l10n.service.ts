import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeInput, GearboxBindingInputAction, PortCommandTask } from '@app/store';

import { IBindingL10n } from '../i-binding-l10n';
import { DirectionAwareControllerInputNameService } from '../common';

@Injectable()
export class GearboxBindingL10nService implements IBindingL10n<ControlSchemeBindingType.Gearbox> {
    public readonly bindingTypeL10nKey = 'controlScheme.gearboxBinding.operationMode';

    constructor(
        private readonly translocoService: TranslocoService,
        private readonly directionAwareControllerNameProvider: DirectionAwareControllerInputNameService,
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.Gearbox>
    ): Observable<string> {
        const level = task.payload.initialLevelIndex - task.payload.angleIndex;
        const angle = task.payload.angle;
        const isLooping = task.payload.isLooping;
        return this.translocoService.selectTranslate('controlScheme.gearboxBinding.taskSummary', { level, angle, isLooping });
    }

    public getBindingInputName(
        actionType: GearboxBindingInputAction
    ): Observable<string> {
        switch (actionType) {
            case GearboxBindingInputAction.NextGear:
                return this.translocoService.selectTranslate('controlScheme.gearboxBinding.nextGear');
            case GearboxBindingInputAction.PrevGear:
                return this.translocoService.selectTranslate('controlScheme.gearboxBinding.prevGear');
            case GearboxBindingInputAction.Reset:
                return this.translocoService.selectTranslate('controlScheme.gearboxBinding.reset');
        }
    }

    public getControllerInputName(
        actionType: GearboxBindingInputAction,
        inputConfig: ControlSchemeInput
    ): Observable<string> {
        switch (actionType) {
            case GearboxBindingInputAction.NextGear:
            case GearboxBindingInputAction.PrevGear:
            case GearboxBindingInputAction.Reset:
                return this.directionAwareControllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }

}
