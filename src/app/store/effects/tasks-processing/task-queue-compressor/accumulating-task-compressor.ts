import { ControlSchemeBindingType } from '@app/shared';

import { ITaskQueueCompressor } from '../i-task-queue-compressor';
import { PortCommandTask, PortCommandTaskPayload } from '../../../models';
import { payloadHash } from '../payload-hash';

export abstract class AccumulatingTaskCompressor<TBindingType extends ControlSchemeBindingType> implements ITaskQueueCompressor {
    protected constructor(
        private readonly taskType: TBindingType
    ) {
    }

    protected abstract buildPayloadChanges(
        accumulatedTasks: Array<PortCommandTask<TBindingType>>
    ): Partial<PortCommandTask<TBindingType>['payload']>;

    /**
     * Compresses tasks into one task with accumulated payload
     * @param queue
     */
    public compress(
        queue: PortCommandTask[]
    ): PortCommandTask[] {
        let firstTaskOfType: PortCommandTask<TBindingType> | null = null;
        let taskOfTypeCount = 0;
        const accumulatedTasks: Array<PortCommandTask<TBindingType>> = [];

        for (let index = 0; index < queue.length; index++) {
            const command = queue[index];
            if (command.payload.bindingType === this.taskType) {
                const task = command as PortCommandTask<TBindingType>;
                if (taskOfTypeCount === 0) {
                    firstTaskOfType = task;
                }
                accumulatedTasks.push(task);
                taskOfTypeCount++;
            }
        }

        if (taskOfTypeCount > 1) {
            return queue.map((task) => {
                if (task === firstTaskOfType) {
                    const updatedFirstTask: PortCommandTask<TBindingType> = {
                        ...firstTaskOfType,
                        payload: {
                            ...firstTaskOfType.payload,
                            ...this.buildPayloadChanges(accumulatedTasks)
                        } as PortCommandTaskPayload & { bindingType: TBindingType },
                    };
                    updatedFirstTask.hash = payloadHash(updatedFirstTask.payload);
                    return updatedFirstTask;
                }
                if (task.payload.bindingType === this.taskType) {
                    return null;
                }
                return task;
            }).filter((task) => task !== null) as PortCommandTask[];
        }
        return queue;
    }
}
