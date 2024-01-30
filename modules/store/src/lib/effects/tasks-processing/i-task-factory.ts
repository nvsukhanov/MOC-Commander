import { Dictionary } from '@ngrx/entity';
import { InjectionToken } from '@angular/core';

import { AttachedIoPropsModel, ControlSchemeBinding, ControllerInputModel, PortCommandTask } from '../../models';

export interface ITaskFactory {
    buildTask(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        lastExecutedTask: PortCommandTask | null
    ): PortCommandTask | null;

    buildCleanupTask(
        previousTask: PortCommandTask
    ): PortCommandTask | null;
}

export const TASK_FACTORY = new InjectionToken<ITaskFactory>('TASK_FACTORY');
