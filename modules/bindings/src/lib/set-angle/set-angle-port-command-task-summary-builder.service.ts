import { Injectable } from '@angular/core';
import { Observable, filter, switchMap } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { ATTACHED_IO_PROPS_SELECTORS, AttachedIoPropsModel, PortCommandTask } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingTaskSummaryBuilder } from '../i-binding-task-summary-builder';

@Injectable()
export class SetAnglePortCommandTaskSummaryBuilderService implements IBindingTaskSummaryBuilder<ControlSchemeBindingType.SetAngle> {
    constructor(
        private readonly translocoService: TranslocoService,
        private readonly store: Store
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.SetAngle>
    ): Observable<string> {
        return this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectById(task)).pipe(
            filter((ioProps): ioProps is AttachedIoPropsModel => !!ioProps),
            switchMap((ioProps: AttachedIoPropsModel) => {
                const angle = (ioProps.motorEncoderOffset ?? 0) + task.payload.angle;
                return this.translocoService.selectTranslate('controlScheme.setAngleBinding.taskSummary', { angle });
            })
        );
    }
}
