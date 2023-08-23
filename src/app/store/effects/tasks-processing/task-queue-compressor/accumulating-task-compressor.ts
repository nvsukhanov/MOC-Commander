import { ITaskQueueCompressor } from '../i-task-queue-compressor';
import { PortCommandTask, PortCommandTaskPayload, PortCommandTaskType } from '../../../models';
import { payloadHash } from '../payload-hash';

export abstract class AccumulatingTaskCompressor<TPortCommandTaskType extends PortCommandTaskType> implements ITaskQueueCompressor {
    protected constructor(
        private readonly taskType: TPortCommandTaskType
    ) {
    }

    protected abstract buildPayloadChanges(
        accumulatedTasks: Array<PortCommandTask<TPortCommandTaskType>>
    ): Partial<PortCommandTask<TPortCommandTaskType>['payload']>;

    /**
     * Compresses tasks into one task with accumulated payload
     * @param queue
     */
    public compress(
        queue: PortCommandTask[]
    ): PortCommandTask[] {
        let firstTaskOfType: PortCommandTask<TPortCommandTaskType> | null = null;
        let taskOfTypeCount = 0;
        const accumulatedTasks: Array<PortCommandTask<TPortCommandTaskType>> = [];

        for (let index = 0; index < queue.length; index++) {
            const command = queue[index];
            if (command.payload.taskType === this.taskType) {
                const task = command as PortCommandTask<TPortCommandTaskType>;
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
                    const updatedFirstTask: PortCommandTask<TPortCommandTaskType> = {
                        ...firstTaskOfType,
                        payload: {
                            ...firstTaskOfType.payload,
                            ...this.buildPayloadChanges(accumulatedTasks)
                        } as PortCommandTaskPayload & { taskType: TPortCommandTaskType },
                    };
                    updatedFirstTask.hash = payloadHash(updatedFirstTask.payload);
                    return updatedFirstTask;
                }
                if (task.payload.taskType === this.taskType) {
                    return null;
                }
                return task;
            }).filter((task) => task !== null) as PortCommandTask[];
        }
        return queue;
    }
}
