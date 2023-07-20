import { InjectionToken } from '@angular/core';

import { ControlSchemeBinding, PortCommandTask } from '../../models';
import { taskBuilderFactory } from './task-builder';

export interface ITaskBuilder {
    build(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): PortCommandTask | null;
}

export const TASK_BUILDER = new InjectionToken<ITaskBuilder>('TASK BUILDER', { factory: taskBuilderFactory });
