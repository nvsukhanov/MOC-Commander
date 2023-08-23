import { PortCommandTask, PortCommandTaskPayload, PortCommandTaskType } from '../../../models';
import { AccumulatingTaskCompressor } from './accumulating-task-compressor';

export class StepperTaskCompressor extends AccumulatingTaskCompressor<PortCommandTaskType.Stepper> {
    constructor() {
        super(PortCommandTaskType.Stepper);
    }

    protected buildPayloadChanges(
        accumulatedTasks: ReadonlyArray<PortCommandTask<PortCommandTaskType.Stepper>>
    ): Partial<PortCommandTaskPayload & { taskType: PortCommandTaskType.Stepper }> {
        return {
            degree: accumulatedTasks.reduce((acc, task) => acc + task.payload.degree, 0)
        };
    }
}
