import { InjectionToken } from '@angular/core';

import { ControlSchemeBinding, PortCommandTask } from '../../models';
import { taskBuilderFactory } from './task-builder';

export interface ITaskBuilder {
    buildTask(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): PortCommandTask | null;

    buildCleanupTask(
        previousTask: PortCommandTask
    ): PortCommandTask | null;
}

export const TASK_BUILDER = new InjectionToken<ITaskBuilder>('TASK BUILDER', { factory: taskBuilderFactory });
