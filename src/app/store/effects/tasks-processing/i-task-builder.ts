import { InjectionToken } from '@angular/core';
import { Dictionary } from '@ngrx/entity';

import { ControlSchemeBinding, ControllerInputModel, PortCommandTask } from '../../models';
import { taskBuilderFactory } from './task-builder';

export interface ITaskBuilder {
    buildTask(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): PortCommandTask | null;

    buildCleanupTask(
        previousTask: PortCommandTask
    ): PortCommandTask | null;
}

export const TASK_BUILDER = new InjectionToken<ITaskBuilder>('TASK BUILDER', { factory: taskBuilderFactory });
