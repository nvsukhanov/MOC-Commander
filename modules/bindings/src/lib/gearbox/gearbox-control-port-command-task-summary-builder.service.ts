import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { PortCommandTask } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingTaskSummaryBuilder } from '../i-binding-task-summary-builder';

@Injectable()
export class GearboxControlPortCommandTaskSummaryBuilderService implements IBindingTaskSummaryBuilder<ControlSchemeBindingType.GearboxControl>{
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.GearboxControl>
    ): Observable<string> {
        const level = task.payload.initialLevelIndex - task.payload.angleIndex;
        const angle = task.payload.angle;
        const isLooping = task.payload.isLooping;
        return this.translocoService.selectTranslate('controlScheme.gearboxControlBinding.taskSummary', { level, angle, isLooping });
    }
}
