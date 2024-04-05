import { InjectionToken } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { AttachedIoPropsModel, ControlSchemeBinding, PortCommandTask } from '../../models';
import { TaskInput } from './i-task-input-extractor';

export interface ITaskFactory<T extends ControlSchemeBindingType = ControlSchemeBindingType> {
    buildTask(
        binding: ControlSchemeBinding & { bindingType: T },
        currentInput: { [k in keyof (ControlSchemeBinding & { bindingType: T })['inputs']]?: TaskInput },
        prevInput: { [k in keyof (ControlSchemeBinding & { bindingType: T })['inputs']]?: TaskInput },
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        lastExecutedTask: PortCommandTask | null
    ): PortCommandTask | null;

    buildCleanupTask(
        previousTask: PortCommandTask
    ): PortCommandTask | null;
}

export const TASK_FACTORY = new InjectionToken<ITaskFactory>('TASK_FACTORY');
