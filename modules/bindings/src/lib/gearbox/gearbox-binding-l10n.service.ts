import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeInputConfig, GearboxBindingInputAction, PortCommandTask } from '@app/store';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService } from '../common';

@Injectable()
export class GearboxBindingL10nService implements IBindingL10n<ControlSchemeBindingType.Gearbox> {
    public readonly bindingTypeL10nKey = 'controlScheme.gearboxBinding.operationMode';

    constructor(
        private readonly translocoService: TranslocoService,
        private readonly controllerNameProvider: ControllerInputNameService,
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
        inputConfig: ControlSchemeInputConfig
    ): Observable<string> {
        switch (actionType) {
            case GearboxBindingInputAction.NextGear:
            case GearboxBindingInputAction.PrevGear:
            case GearboxBindingInputAction.Reset:
                return this.controllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
