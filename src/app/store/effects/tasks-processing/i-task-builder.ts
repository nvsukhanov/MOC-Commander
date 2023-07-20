import { InjectionToken } from '@angular/core';

import { ControlSchemeV2Binding, PortCommandTask } from '../../models';
import { taskBuilderFactory } from './task-builder';

export interface ITaskBuilder {
    build(
        binding: ControlSchemeV2Binding,
        inputValue: number,
        motorEncoderOffset: number,
        previousTask: PortCommandTask | null
    ): PortCommandTask | null;
}

export const TASK_BUILDER = new InjectionToken<ITaskBuilder>('TASK BUILDER', { factory: taskBuilderFactory });
