import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask, PortCommandTaskPayload } from '../../../models';
import { AccumulatingTaskCompressor } from './accumulating-task-compressor';

export class StepperTaskCompressor extends AccumulatingTaskCompressor<ControlSchemeBindingType.Stepper> {
    constructor() {
        super(ControlSchemeBindingType.Stepper);
    }

    protected buildPayloadChanges(
        accumulatedTasks: ReadonlyArray<PortCommandTask<ControlSchemeBindingType.Stepper>>
    ): Partial<PortCommandTaskPayload & { bindingType: ControlSchemeBindingType.Stepper }> {
        return {
            degree: accumulatedTasks.reduce((acc, task) => acc + task.payload.degree, 0)
        };
    }
}
