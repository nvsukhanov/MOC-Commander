import { InjectionToken } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { AttachedIoPropsModel, ControlSchemeBinding, ControllerInputModel, PortCommandTask } from '../../models';

export interface ITaskFactory<T extends ControlSchemeBindingType = ControlSchemeBindingType> {
    buildTask(
        binding: ControlSchemeBinding & { bindingType: T },
        currentInput: { [k in keyof (ControlSchemeBinding & { bindingType: T })['inputs']]: ControllerInputModel | null },
        prevInput: { [k in keyof (ControlSchemeBinding & { bindingType: T })['inputs']]: ControllerInputModel | null },
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        lastExecutedTask: PortCommandTask | null
    ): PortCommandTask | null;

    buildCleanupTask(
        previousTask: PortCommandTask
    ): PortCommandTask | null;
}

export const TASK_FACTORY = new InjectionToken<ITaskFactory>('TASK_FACTORY');
